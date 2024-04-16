CREATE TABLE public.template
(
    id serial,
    name text NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uc_template_name UNIQUE (name)
);

ALTER TABLE IF EXISTS public.template
    OWNER to postgres;

CREATE TABLE public.property
(
    id serial,
    name text NOT NULL,
    type character varying(16) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uc_property_name UNIQUE (name),
    CONSTRAINT check_property_type CHECK (type in ('string', 'number', 'boolean')) NOT VALID
);

ALTER TABLE IF EXISTS public.property
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.template_property
(
    template_id integer NOT NULL,
    property_id integer NOT NULL,
    index integer NOT NULL,
    CONSTRAINT template_property_pkey PRIMARY KEY (template_id, property_id),
    CONSTRAINT uc_template_property_index UNIQUE (template_id, property_id, index),
    CONSTRAINT fk_property_id FOREIGN KEY (property_id)
        REFERENCES public.property (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_template_id FOREIGN KEY (template_id)
        REFERENCES public.template (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.template_property
    OWNER to postgres;