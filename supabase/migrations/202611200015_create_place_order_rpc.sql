create or replace function public.place_order(
  p_user_id uuid,
  p_items jsonb,
  p_shipping_address jsonb,
  p_customer_email text,
  p_customer_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_order_id uuid;
  v_order_number text;
  v_total numeric(12, 2) := 0;
  v_product_id uuid;
  v_quantity integer;
begin
  if p_user_id is null
     or jsonb_typeof(p_items) is distinct from 'array'
     or jsonb_array_length(p_items) = 0
     or jsonb_typeof(p_shipping_address) is distinct from 'object' then
    raise exception 'place_order: invalid input' using errcode = '22023';
  end if;

  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'place_order: unknown user' using errcode = '23503';
  end if;

  loop
    v_order_number := 'PC-'
      || to_char(now() at time zone 'UTC', 'YYYYMMDD')
      || '-'
      || upper(substring(gen_random_uuid()::text from 1 for 8));
    exit when not exists (select 1 from public.orders where order_number = v_order_number);
  end loop;

  insert into public.orders (
    order_number, user_id, total_egp, customer_email, customer_phone, shipping_address
  ) values (
    v_order_number, p_user_id, 0, p_customer_email, p_customer_phone, p_shipping_address
  )
  returning id into v_order_id;

  for v_item in
    select items.value
    from jsonb_array_elements(p_items) as items(value)
    order by items.value->>'product_id'
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_product_id is null or v_quantity is null or v_quantity <= 0 then
      raise exception 'place_order: invalid item' using errcode = '22023';
    end if;

    select p.*
    into v_product
    from public.products as p
    where p.id = v_product_id
    for update;

    if not found
       or not v_product.is_published
       or (v_product.published_at is not null and v_product.published_at > now()) then
      raise exception 'place_order: product unavailable' using errcode = '22023';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'place_order: insufficient stock' using errcode = '22023';
    end if;

    update public.products
    set stock = stock - v_quantity
    where id = v_product_id and stock >= v_quantity;

    if not found then
      raise exception 'place_order: insufficient stock' using errcode = '22023';
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, sku, unit_price_egp, quantity, selected_specs
    ) values (
      v_order_id, v_product_id, v_product.name, v_product.sku,
      v_product.price_egp, v_quantity, v_product.specs
    );

    v_total := v_total + (v_product.price_egp * v_quantity);
  end loop;

  update public.orders
  set total_egp = round(v_total, 2)
  where id = v_order_id;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total_egp', round(v_total, 2)
  );
end;
$$;

revoke all on function public.place_order(uuid, jsonb, jsonb, text, text)
  from public, anon, authenticated;

grant execute on function public.place_order(uuid, jsonb, jsonb, text, text)
  to service_role;
