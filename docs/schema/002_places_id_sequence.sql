-- Forward migration for fresh databases. Live Neon already repaired: DO NOT RUN there.
-- Preserves existing sequences and never rewinds IDs. No content changes.
BEGIN;
LOCK TABLE public.places IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE next_id bigint;
BEGIN
  IF pg_get_serial_sequence('public.places', 'id') IS NULL THEN
    IF to_regclass('public.places_id_seq') IS NOT NULL THEN
      RAISE EXCEPTION 'Unowned places_id_seq exists; inspect manually';
    END IF;
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM public.places;
    EXECUTE format('CREATE SEQUENCE public.places_id_seq AS integer START WITH %s', next_id);
    ALTER SEQUENCE public.places_id_seq OWNED BY public.places.id;
    ALTER TABLE public.places ALTER COLUMN id SET DEFAULT nextval('public.places_id_seq'::regclass);
  END IF;
END $$;
COMMIT;
