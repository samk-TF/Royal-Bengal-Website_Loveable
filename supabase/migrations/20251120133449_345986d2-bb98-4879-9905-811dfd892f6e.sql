-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  special_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (kitchen doesn't need authentication)
CREATE POLICY "Anyone can view orders"
ON public.orders FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
ON public.orders FOR UPDATE
USING (true);

CREATE POLICY "Anyone can view order items"
ON public.order_items FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- Create index for better performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);