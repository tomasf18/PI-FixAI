-- SQLBook: Code
// drop all
-- DROP TABLE IF EXISTS Auth.users;
-- DROP TABLE IF EXISTS Auth.operators;
-- DROP TABLE IF EXISTS Auth.confirmation_codes;

// create tables
CREATE TABLE IF NOT EXISTS Auth.users (
    email text,
    
    password_hash text,
    created_at timestamp,
    user_id uuid,
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS Auth.operators (
    email text,
    
    password_hash text,
    created_at timestamp,
    organization_id uuid,
    operator_id uuid,
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS Auth.confirmation_codes (
    email text,
    code text,
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS Auth.refresh_tokens (
    refresh_token text,
    PRIMARY KEY (refresh_token)
);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// drop all
-- DROP TABLE IF EXISTS H3_index.organization_regions;
-- DROP TABLE IF EXISTS H3_index.incidents_regions;

// create tables
CREATE TABLE IF NOT EXISTS H3_index.organization_regions (    
    h3_index text,

    organization_id uuid,
    PRIMARY KEY (h3_index)
);

CREATE TABLE IF NOT EXISTS H3_index.incidents_regions (
    h3_index text,

    incident_ids set<uuid>,
    PRIMARY KEY (h3_index)
);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// drop all
-- DROP TABLE IF EXISTS App_data.user_profile;
-- DROP TABLE IF EXISTS App_data.organization;
-- DROP TABLE IF EXISTS App_data.user_occurrence_by_status;
-- DROP TABLE IF EXISTS App_data.occurrence_details;
-- DROP TABLE IF EXISTS App_data.category;
-- DROP TABLE IF EXISTS App_data.incident_occurrences;
-- DROP TABLE IF EXISTS App_data.incident_details;
-- DROP TABLE IF EXISTS App_data.incident_by_status;
-- DROP TABLE IF EXISTS App_data.incident_by_status_and_category;


// create tables
CREATE TABLE IF NOT EXISTS App_data.user_profile (    
    user_id uuid,

    name text,
    email_notification_flag boolean,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS App_data.organization (
    organization_id uuid,

    name text,
    language text,
    logo text,
    PRIMARY KEY (organization_id)
);

CREATE TABLE IF NOT EXISTS App_data.user_occurrence_by_status (
    user_id uuid,
    time_id timeuuid,
    status text,

    occurrence_id uuid,
    photo_id uuid,
    photo_latitude double,
    photo_longitude double,
    category text,
    PRIMARY KEY ((user_id, status), time_id)
) WITH CLUSTERING ORDER BY (time_id DESC);

CREATE TABLE IF NOT EXISTS App_data.occurrence_details (
    occurrence_id uuid,

    user_id uuid,
    organization_id uuid,
    incident_id uuid,
    time_id timeuuid,
    photo_id uuid,
    photo_latitude double,
    photo_longitude double,
    description text,
    category text,
    status text,
    PRIMARY KEY (occurrence_id)
);

CREATE TABLE IF NOT EXISTS App_data.category (
    organization_id uuid,
    category text,

    description text,
    num_pending int,
    num_in_progress int,
    num_resolved int,
    PRIMARY KEY (organization_id, category)
);

CREATE TABLE IF NOT EXISTS App_data.incident_occurrences (
    organization_id uuid,
    incident_id uuid,
    occurrence_time_id timeuuid,

    photo_id uuid,
    photo_latitude double,
    photo_longitude double,
    occurrence_id uuid,
    user_id uuid,
    PRIMARY KEY (incident_id, occurrence_time_id)
) WITH CLUSTERING ORDER BY (occurrence_time_id DESC);

CREATE TABLE IF NOT EXISTS App_data.incident_details (
    organization_id uuid, 
    incident_id uuid,

    first_occurrence_time_id timeuuid,
    first_photo_id uuid,
    num_occurrences int,
    severity text,
    centroid_latitude double,
    centroid_longitude double,
    main_description text,
    main_category text,
    status text,
    PRIMARY KEY (incident_id)
);

CREATE TABLE IF NOT EXISTS App_data.incident_by_status (
    organization_id uuid,
    first_occurrence_time_id timeuuid,
    status text,
    main_category text,
    incident_id uuid,

    first_photo_id uuid,
    severity text,
    centroid_latitude double,
    centroid_longitude double,
    num_occurrences int,
    PRIMARY KEY ((organization_id, status), first_occurrence_time_id)
) WITH CLUSTERING ORDER BY (first_occurrence_time_id DESC);

CREATE TABLE IF NOT EXISTS App_data.incident_by_status_and_category (
    organization_id uuid,
    first_occurrence_time_id timeuuid,
    status text,
    main_category text,
    incident_id uuid,

    first_photo_id uuid,
    severity text,
    centroid_latitude double,
    centroid_longitude double,
    num_occurrences int,
    PRIMARY KEY ((organization_id, status, main_category), first_occurrence_time_id)
) WITH CLUSTERING ORDER BY (first_occurrence_time_id DESC);

CREATE TABLE IF NOT EXISTS App_data.incident_resolved_reason (
    incident_id uuid,
    created_at timestamp,
    video_id uuid,

    edge_data_id uuid,
    PRIMARY KEY (incident_id, created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);
