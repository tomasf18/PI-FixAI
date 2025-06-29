-- -- SQLBook: Code
-- // Insert data for Auth.users
-- INSERT INTO Auth.users (email, password_hash, created_at, user_id)
-- VALUES ('john.doe@example.com', '$2b$12$DcRHWE7MkOGissgX6sPq..nYuVFa/uLGXd2xyV1D8fYGj/ffeOW1m', toTimestamp(now()), 00000000-0000-0000-1111-000000000000);

-- INSERT INTO Auth.users (email, password_hash, created_at, user_id)
-- VALUES ('jane.smith@example.com', 'hash3', toTimestamp(now()), 00000000-0000-0000-2222-000000000000);


-- // Insert data for Auth.operators
-- INSERT INTO Auth.operators (email, password_hash, created_at, organization_id, operator_id)
-- VALUES ('op1@example.com', '$2b$12$/jsbraLU2tIVwh825TaqQ.8YVSke3FxSuy49vnCQWckauLAu/ZAU6', toTimestamp(now()), c62f55eb-4db2-450f-a8d4-df4d88c776b5, 00000000-1111-0000-0000-000000000000);

-- INSERT INTO Auth.operators (email, password_hash, created_at, organization_id, operator_id)
-- VALUES ('op2@example.com', '$2b$12$SOwW0bHCivITRxmZTPjdi.T81PPonybgrR310GF83IZE2DZCfGb9.', toTimestamp(now()), 00000000-0000-2222-0000-000000000000, 00000000-2222-0000-0000-000000000000);

-- INSERT INTO Auth.operators (email, password_hash, created_at, organization_id, operator_id)
-- VALUES ('op3@example.com', '$2b$12$dfmNUxoQnwjajF/tbjyHROSFL8qJbWo6f7UqLXXucK1fXrcO70EjC', toTimestamp(now()), 00000000-0000-3333-0000-000000000000, 00000000-3333-0000-0000-000000000000);

-- INSERT INTO Auth.operators (email, password_hash, created_at, organization_id, operator_id)
-- VALUES ('op4@example.com', '$2b$12$4pj8OeIHwzOTXuJ8C86ate2qowRJEKwNSwr.U9PMAKb3z6Jg/xgRG', toTimestamp(now()), 00000000-0000-4444-0000-000000000000, 00000000-4444-0000-0000-000000000000);

-- INSERT INTO Auth.operators (email, password_hash, created_at, organization_id, operator_id)
-- VALUES ('op5@example.com', '$2b$12$krm4mt3JMO8BfIeBNic3d.9oRkOQvT1IreIkHUc78Fz6uSRoCRk36', toTimestamp(now()), 00000000-0000-5555-0000-000000000000, 00000000-5555-0000-0000-000000000000);



-- // Insert data for H3_index.organization_regions
-- INSERT INTO H3_index.organization_regions (h3_index, organization_id)
-- VALUES ('875850784ffffff', c62f55eb-4db2-450f-a8d4-df4d88c776b5); -- lat=12.0, long=12.0, res=7

-- -- INSERT INTO H3_index.organization_regions (h3_index, organization_id)
-- -- VALUES ('875850784ffffff', c62f55eb-4db2-450f-a8d4-df4d88c776b5);
    



-- // Insert data for H3_index.incidents_regions
-- INSERT INTO H3_index.incidents_regions (h3_index, incident_ids)
-- VALUES ('8d283082800b3bf', {00000000-1111-1111-1111-000000000000});

-- INSERT INTO H3_index.incidents_regions (h3_index, incident_ids)
-- VALUES ('8a2a107a6f1c884', {00000000-0000-0000-0000-000000000002});




-- // Insert data for App_data.user_profile
-- INSERT INTO App_data.user_profile (user_id, name, email_notification_flag)
-- VALUES (00000000-0000-0000-1111-000000000000, 'John Doe', true);

-- INSERT INTO App_data.user_profile (user_id, name, email_notification_flag)
-- VALUES (00000000-0000-0000-2222-000000000000, 'Jane Smith', false);




-- // Insert data for App_data.organization
-- INSERT INTO App_data.organization (organization_id, name, language)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'Organization A', 'English');

-- INSERT INTO App_data.organization (organization_id, name, language)
-- VALUES (00000000-0000-2222-0000-000000000000, 'Organization B', 'Portuguese');




-- // Insert data for App_data.user_occurrence_by_status
-- INSERT INTO App_data.user_occurrence_by_status (user_id, status, time_id, occurrence_id, photo_id, photo_latitude, photo_longitude, category)
-- VALUES (00000000-0000-0000-1111-000000000000, 'in_progress', c33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000001, uuid(), 37.7749, -122.4194, 'traffic_lights');

-- INSERT INTO App_data.user_occurrence_by_status (user_id, status, time_id, occurrence_id, photo_id, photo_latitude, photo_longitude, category)
-- VALUES (00000000-0000-0000-2222-000000000000, 'in_progress', d33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000002, uuid(), 34.0522, -118.2437, 'traffic_lights');

-- INSERT INTO App_data.user_occurrence_by_status (user_id, status, time_id, occurrence_id, photo_id, photo_latitude, photo_longitude, category)
-- VALUES (00000000-0000-0000-1111-000000000000, 'resolved', minTimeuuid('2022-03-03 00:00:00+0000'), uuid(), uuid(), 34.0522, -118.2437, 'pavement');

-- INSERT INTO App_data.user_occurrence_by_status (user_id, status, time_id, occurrence_id, photo_id, photo_latitude, photo_longitude, category)
-- VALUES (00000000-0000-0000-1111-000000000000, 'resolved', minTimeuuid('2022-02-02 00:00:00+0000'), uuid(), uuid(), 34.0522, -118.2437, 'pavement');


-- // Insert data for App_data.occurrence_details
-- INSERT INTO App_data.occurrence_details (occurrence_id, incident_id, time_id, photo_id, photo_latitude, photo_longitude, description, category, status, user_id, organization_id)
-- VALUES (00000000-1111-1111-1111-000000000001, 00000000-1111-1111-1111-000000000000, c33f0000-6a95-11ec-8080-808080808080, uuid(), 37.7749, -122.4194, 'An incident in the bay area', 'traffic_lights', 'in_progress', d33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000002);

-- INSERT INTO App_data.occurrence_details (occurrence_id, incident_id, time_id, photo_id, photo_latitude, photo_longitude, description, category, status, user_id, organization_id)
-- VALUES (00000000-1111-1111-1111-000000000002, 00000000-1111-1111-1111-000000000000, d33f0000-6a95-11ec-8080-808080808080, uuid(), 40.7128, -74.0060, 'An incident in the bay area', 'traffic_lights', 'in_progress', 00000000-0000-0000-2222-000000000000, c62f55eb-4db2-450f-a8d4-df4d88c776b5);



-- // Insert data for App_data.category
-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'traffic_lights', 'traffic_lights_desc', 5, 2, 10);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'urban_drainage', 'urban_drainage_desc', 3, 1, 7);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'pavement', 'pavement_desc', 1, 2, 9);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'traffic_signs', 'traffic_signs_desc', 1, 4, 10);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'infrastructure', 'infrastructure_desc', 3, 4, 8);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'lighting', 'lighting_desc', 2, 7, 12);

-- INSERT INTO App_data.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, 'others', 'others_desc', 5, 10, 18);

-- // Insert data for App_data.incident_occurrences
-- INSERT INTO App_data.incident_occurrences (incident_id, occurrence_time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude)
-- VALUES (00000000-1111-1111-1111-000000000000, c33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000001, 00000000-0000-0000-1111-000000000000,uuid(), 37.7749, -122.4194);

-- INSERT INTO App_data.incident_occurrences (incident_id, occurrence_time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude)
-- VALUES (00000000-1111-1111-1111-000000000000, d33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000002, 00000000-0000-0000-2222-000000000000,uuid(), 40.7128, -74.0060);


-- // Insert data for App_data.incident_details
-- INSERT INTO App_data.incident_details (incident_id, first_occurrence_time_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, organization_id, first_photo_id)
-- VALUES (00000000-1111-1111-1111-000000000000, c33f0000-6a95-11ec-8080-808080808080, 5, 'high', 37.7749, -122.4194, 'A large traffic_lights in the city', 'traffic_lights', 'in_progress', c62f55eb-4db2-450f-a8d4-df4d88c776b5, uuid());

-- INSERT INTO App_data.incident_details (incident_id, first_occurrence_time_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, organization_id, first_photo_id)
-- VALUES (uuid(), now(), 3, 'medium', 34.0522, -118.2437, 'Flood in downtown area', 'urban_drainage', 'resolved', c62f55eb-4db2-450f-a8d4-df4d88c776b5, uuid());


// Insert data for App_data.incident_by_status

-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);

-- // Insert data for App_data.incident_by_status_and_category
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)
-- VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);

-- INSERT INTO App_data.incident_occurrences (incident_id, occurrence_time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude)
-- VALUES (00000000-1111-1111-1111-000000000000, d33f0000-6a95-11ec-8080-808080808080, 00000000-1111-1111-1111-000000000002, 00000000-0000-0000-2222-000000000000,uuid(), 40.7128, -74.0060);


-- // Insert data for App_data.incident_details
-- INSERT INTO App_data.incident_details (incident_id, first_occurrence_time_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, organization_id, first_photo_id)
-- VALUES (00000000-1111-1111-1111-000000000000, c33f0000-6a95-11ec-8080-808080808080, 5, 'high', 37.7749, -122.4194, 'A large traffic_lights in the city', 'traffic_lights', 'in_progress', c62f55eb-4db2-450f-a8d4-df4d88c776b5, uuid());

-- INSERT INTO App_data.incident_details (incident_id, first_occurrence_time_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, organization_id, first_photo_id)
-- VALUES (uuid(), now(), 3, 'medium', 34.0522, -118.2437, 'Flood in downtown area', 'urban_drainage', 'resolved', c62f55eb-4db2-450f-a8d4-df4d88c776b5, uuid());


-- // Insert data for App_data.incident_by_status
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organizatime_idtion_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);

-- // Insert data for App_data.incident_by_status_and_category
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, c33f0000-6a95-11ec-8080-808080808080, 'in_progress', 'traffic_lights', 00000000-1111-1111-1111-000000000000, uuid(), 'High', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'traffic_lights', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'pending', 'urban_drainage', uuid(), uuid(), 'high', 37.7749, -122.4194, 5);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'traffic_lights', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
-- INSERT INTO App_data.incident_by_status_and_category (organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences) VALUES (c62f55eb-4db2-450f-a8d4-df4d88c776b5, now(), 'resolved', 'urban_drainage', uuid(), uuid(), 'medium', 34.0522, -118.2437, 3);
