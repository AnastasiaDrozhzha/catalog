CREATE TABLE public.template
(
    id serial,
    name text NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uc_name UNIQUE (name)
);

ALTER TABLE IF EXISTS public.template
    OWNER to postgres;