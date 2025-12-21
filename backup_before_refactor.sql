--
-- PostgreSQL database dump
--

\restrict a0y0tHuijHNSTY1jekFeOP47me6lYHioeKUJtvKadwuRmSazcuVQqPqofrO5BNV

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: waste_requests_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.waste_requests_status_enum AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'enroute',
    'completed'
);


ALTER TYPE public.waste_requests_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "companyName" character varying NOT NULL,
    "companyLogo" character varying,
    industry character varying,
    address character varying,
    "registrationNumber" character varying,
    website character varying,
    description text,
    "verificationStatus" character varying DEFAULT 'pending'::character varying NOT NULL,
    phone character varying,
    city character varying,
    state character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "licenseNumber" character varying,
    "taxId" character varying,
    "operatingHours" character varying,
    "workingDays" character varying,
    "responseTime" character varying,
    "serviceRadius" character varying,
    "minCollection" character varying,
    "notificationSettings" text,
    name character varying,
    "userId" integer NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    id integer NOT NULL,
    "registrationNumber" character varying,
    industry character varying,
    address character varying,
    website character varying,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "companyName" character varying NOT NULL,
    "companyLogo" character varying,
    "verificationStatus" character varying DEFAULT 'pending'::character varying NOT NULL,
    phone character varying,
    city character varying,
    state character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    description text,
    "isVerified" boolean DEFAULT false NOT NULL,
    name character varying,
    "userId" integer,
    "licenseNumber" character varying,
    "taxId" character varying,
    "operatingHours" character varying,
    "workingDays" character varying,
    "responseTime" character varying,
    "serviceRadius" character varying,
    "minCollection" character varying,
    "notificationSettings" text
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_id_seq OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    "companyName" character varying,
    "companyRegNumber" character varying,
    industry character varying,
    "companyAddress" character varying,
    "companyWebsite" character varying,
    "companyDescription" character varying,
    "companyLogo" character varying,
    phone character varying,
    address character varying,
    bio character varying,
    avatar character varying,
    "privacySettings" json DEFAULT '{"profileVisibility":"public","showEmail":false,"showPhone":false}'::json,
    "wastePreferences" json DEFAULT '{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}'::json
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: verification_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_request (
    id integer NOT NULL,
    "documentUrl" character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "adminNotes" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "companyId" integer
);


ALTER TABLE public.verification_request OWNER TO postgres;

--
-- Name: verification_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_request_id_seq OWNER TO postgres;

--
-- Name: verification_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_request_id_seq OWNED BY public.verification_request.id;


--
-- Name: waste_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waste_request (
    id integer NOT NULL,
    "wasteType" character varying NOT NULL,
    address character varying NOT NULL,
    "preferredDate" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "companyId" integer,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    price integer
);


ALTER TABLE public.waste_request OWNER TO postgres;

--
-- Name: waste_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waste_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waste_request_id_seq OWNER TO postgres;

--
-- Name: waste_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waste_request_id_seq OWNED BY public.waste_request.id;


--
-- Name: waste_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waste_requests (
    id integer NOT NULL,
    "wasteType" character varying NOT NULL,
    address text NOT NULL,
    "preferredDate" date NOT NULL,
    status public.waste_requests_status_enum DEFAULT 'pending'::public.waste_requests_status_enum NOT NULL,
    price numeric(10,2),
    notes character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    company_id integer
);


ALTER TABLE public.waste_requests OWNER TO postgres;

--
-- Name: waste_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waste_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waste_requests_id_seq OWNER TO postgres;

--
-- Name: waste_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waste_requests_id_seq OWNED BY public.waste_requests.id;


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: verification_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_request ALTER COLUMN id SET DEFAULT nextval('public.verification_request_id_seq'::regclass);


--
-- Name: waste_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_request ALTER COLUMN id SET DEFAULT nextval('public.waste_request_id_seq'::regclass);


--
-- Name: waste_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_requests ALTER COLUMN id SET DEFAULT nextval('public.waste_requests_id_seq'::regclass);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, email, password, "companyName", "companyLogo", industry, address, "registrationNumber", website, description, "verificationStatus", phone, city, state, "createdAt", "updatedAt", "isVerified", "licenseNumber", "taxId", "operatingHours", "workingDays", "responseTime", "serviceRadius", "minCollection", "notificationSettings", name, "userId") FROM stdin;
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (id, "registrationNumber", industry, address, website, email, password, "companyName", "companyLogo", "verificationStatus", phone, city, state, "createdAt", "updatedAt", description, "isVerified", name, "userId", "licenseNumber", "taxId", "operatingHours", "workingDays", "responseTime", "serviceRadius", "minCollection", "notificationSettings") FROM stdin;
1	RC-7474643	\N	Afoma lane, arho road, ughelli delta state.	\N	wasteNg@gmail.com	$2b$10$PC8ZccK5BQhc0CDL36x0sewzsrsZaW0ChwRf2JYqW9.jJRsGyRzEG	wastemanagent SWift	https://res.cloudinary.com/dntdadbuy/image/upload/v1765366163/wasteng/avatars/gi0owxx5kxapbg8qnksu.jpg	pending	\N	\N	\N	2025-12-10 00:29:10.15919	2025-12-10 12:29:24.143113	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	RC-947466555	\N	Afoma lane, arho road, ughelli delta state.	jdhlfudhlwew.com	jdhdhsjsjdjdg@gmail.com	$2b$10$Iyv4blwohkCLO7no85Zt1uGjbsXEtp2MSjCVzG447SRGwiE86hSwu	wasgftlgyugyf	https://res.cloudinary.com/dntdadbuy/image/upload/v1765389684/wasteng/avatars/x97mltfbzoltgjrqdnrw.jpg	pending	090900998887	\N	\N	2025-12-10 00:29:10.15919	2025-12-11 14:07:51.412272	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, password, role, "companyName", "companyRegNumber", industry, "companyAddress", "companyWebsite", "companyDescription", "companyLogo", phone, address, bio, avatar, "privacySettings", "wastePreferences") FROM stdin;
1	John Doe	john@example.com	$2b$10$YLPQM.vM6uxf30Wb5Sf7zearCgHjzPtxf3wzy5mlGZ4r.X6G424PK	user	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
3	John	john@gmail.com	$2b$10$Bl2Aksq9l4y5zqVD32c1d.Thqa/d7tAB6afOoJuqP1lSZKSF.H7uO	company	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
4	John	totoboy@gmail.com	$2b$10$SUZW5hECjeCzf/5oS7l3ve92Nt4NIrP.aNsHLo8/8zxsHCDcDkIbq	company	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
5	John smith	smith@example.com	$2b$10$wTesK4xZIXYH9iYecnXVle0kYDqWAE.yajEYnZWKflj3Qc6pxxnGO	company	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
6	Efe Max	efemax@gmail.com	$2b$10$pZyNrV0i3UpLRLywBPcdn.5ltntB.Ps3QcgM/6yZuNHH0aeJeJlbO	company	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
7	Amaka fine	amakafine@gmail.com	$2b$10$H7w1SbKGH1k01LTw1U7NnuN4O6i.CiM16tCwraFARCUAVArU5NSkC	company	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
8	okoro blessing	okoro@gmail.com	$2b$10$A9jz0GrY7d2QnpY32rq2gef98EkEra7X8u.mzDoCdvlwL1hdaIuuS	user	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
9	Pounds	pounds@gmail.com	$2b$10$r7VGFzlXUIMdm0Iv.z.KnOjZnGCaFkWEHgthioZFxyz2gEXTx6UH6	admin	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
11	Amaka Okoro	createcoinio@gmail.com	$2b$10$3e9FhkuQZYyp7thgBdmkauGp15cKyvMy.1MErIxZ5jLjHMjB8KSim	user	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
12	Smith James	smithp@gmail.com	$2b$10$7eDc4Qbsv.woaMz67o.KDu9s2nqrFa2sZEA86B3.pzWVSNdk2P.0W	user	\N	\N	\N	\N	\N	\N	\N		\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
13	Deborah Oderhohwo	oderhohwo@gmail.com	$2b$10$0KN.1MyRD5s9YV05C.Mf2umZjNdsMBYCWnfbJCdtquPYKr5nex75u	user	\N	\N	\N	\N	\N	\N	\N	09036709647	\N	\N	https://res.cloudinary.com/dntdadbuy/image/upload/v1764790859/wasteng/avatars/qjtwy4lzfbt2ettw5phz.jpg	{"profileVisibility":"companies-only","showEmail":true,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":true}
10	Efe Oderhohwo	davidoders788@gmail.com	$2b$10$cdxk/weMy4Vr39dKz.5CaeKQTo.cSCAUCopQMSW49SDG7BhHTGklS	user	\N	\N	\N	\N	\N	\N	\N	+23479474632	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
17	Waste Decade	hooking@gmail.com	$2b$10$bGMFLLcPyhNn/HCePoSRFuaTEgDMZvt/smWNAh2zi7DOOW/P.hcGK	company	Waste Decade	\N	\N	\N	\N	\N	\N	09036709646	Afoma lane, arho road, ughelli delta state.	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
18	hehhueueeuoeegydgyeuygdew	topking@gmail.com	$2b$10$.p5GJn0YWlhGUwwv0RiWIOBgmx83Uv9Vc/evKiC1un8grT/mCRtOC	company	hehhueueeuoeegydgyeuygdew	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"profileVisibility":"public","showEmail":false,"showPhone":false}	{"notifyNewCompanies":true,"notifyPriceChanges":true,"preferredCategories":[],"autoAcceptOffers":false}
\.


--
-- Data for Name: verification_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification_request (id, "documentUrl", status, "adminNotes", "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: waste_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waste_request (id, "wasteType", address, "preferredDate", "createdAt", "updatedAt", "userId", "companyId", status, price) FROM stdin;
1	Plastic	hdigyiqsyguyqreiugyef	2025-12-04 00:00:00	2025-12-03 21:35:00.062967	2025-12-03 21:35:00.062967	13	\N	pending	\N
2	Paper	uhfuyruiqeruidhcyygfqyoygyqgugrftvgefrueigyrfyusgrhheruuquygwwy	2025-12-04 01:00:00	2025-12-03 22:12:38.389204	2025-12-03 22:12:38.389204	13	\N	pending	\N
\.


--
-- Data for Name: waste_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waste_requests (id, "wasteType", address, "preferredDate", status, price, notes, "createdAt", "updatedAt", user_id, company_id) FROM stdin;
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 1, false);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 18, true);


--
-- Name: verification_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_request_id_seq', 1, false);


--
-- Name: waste_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waste_request_id_seq', 2, true);


--
-- Name: waste_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waste_requests_id_seq', 1, false);


--
-- Name: company PK_056f7854a7afdba7cbd6d45fc20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY (id);


--
-- Name: waste_request PK_1fb41c8206dfbc98be3af6885e9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_request
    ADD CONSTRAINT "PK_1fb41c8206dfbc98be3af6885e9" PRIMARY KEY (id);


--
-- Name: verification_request PK_9d9499e0fabae343c7ec3ecfac9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_request
    ADD CONSTRAINT "PK_9d9499e0fabae343c7ec3ecfac9" PRIMARY KEY (id);


--
-- Name: waste_requests PK_c9e09571659012425a86534ca76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_requests
    ADD CONSTRAINT "PK_c9e09571659012425a86534ca76" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: companies PK_d4bc3e82a314fa9e29f652c2c22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY (id);


--
-- Name: company UQ_b0fc567cf51b1cf717a9e8046a1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1" UNIQUE (email);


--
-- Name: companies UQ_d0af6f5866201d5cb424767744a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT "UQ_d0af6f5866201d5cb424767744a" UNIQUE (email);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: waste_requests FK_640b8783959a89852034f06cde4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_requests
    ADD CONSTRAINT "FK_640b8783959a89852034f06cde4" FOREIGN KEY (company_id) REFERENCES public.company(id);


--
-- Name: waste_request FK_75653892b5d19f2615f8aa6d057; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_request
    ADD CONSTRAINT "FK_75653892b5d19f2615f8aa6d057" FOREIGN KEY ("companyId") REFERENCES public.company(id);


--
-- Name: verification_request FK_bda5f54e31e5ca10c14e9e675fe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_request
    ADD CONSTRAINT "FK_bda5f54e31e5ca10c14e9e675fe" FOREIGN KEY ("companyId") REFERENCES public.company(id);


--
-- Name: waste_request FK_c193acc5786a5610761b38b7840; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_request
    ADD CONSTRAINT "FK_c193acc5786a5610761b38b7840" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: waste_requests FK_c66d08097e7f3e3552a82316f1f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste_requests
    ADD CONSTRAINT "FK_c66d08097e7f3e3552a82316f1f" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict a0y0tHuijHNSTY1jekFeOP47me6lYHioeKUJtvKadwuRmSazcuVQqPqofrO5BNV

