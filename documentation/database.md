// Tabela de Usuários (Versão Simplificada)
Table users {
id int [pk, increment]
google_id varchar [unique]
name varchar [not null]
email varchar [not null, unique]
password_hash varchar
phone varchar
favorite_food varchar
favorite_type varchar
profile_picture varchar
created_at timestamp 
last_login timestamp
}

// Tabela de Grupos (Essencial)
Table groups {
id int [pk, increment]
name varchar [not null]
description text
created_by int [ref: > users.id]
created_at timestamp 
cover_photo varchar
}

// Tabela de Membros dos Grupos
Table group_members {
id int [pk, increment]
group_id int [ref: > groups.id]
user_id int [ref: > users.id]
role enum('admin', 'member') [default: 'member']
joined_at timestamp
}

// Tabela de Restaurantes (Foco nas Informações Chave)
Table restaurants {
id int [pk, increment]
name varchar [not null]
address varchar [not null]
category varchar [note: 'Ex: Brasileira, Japonesa']
service_type varchar [note: 'Ex: Rodízio, À la carte']
price_range enum('$', '$$', '$$$', '$$$$')
delivery_available boolean [default: false]
opening_hours varchar
latitude decimal(9,6)
longitude decimal(9,6)
created_by int [ref: > users.id]
created_at timestamp 
}

// Tabela de Avaliações (Simplificada)
Table reviews {
id int [pk, increment]
restaurant_id int [ref: > restaurants.id]
user_id int [ref: > users.id]
rating decimal(2,1) [note: '0.0 a 5.0']
comment text
visit_date date
created_at timestamp 
}

// Tabela de Fotos (Essencial)
Table photos {
id int [pk, increment]
review_id int [ref: > reviews.id]
photo_url varchar [not null]
created_at timestamp 
}

// Wishlist Grupal (Versão Minimalista)
Table group_wishlist {
id int [pk, increment]
group_id int [ref: > groups.id]
restaurant_id int [ref: > restaurants.id]
added_by int [ref: > users.id]
created_at timestamp 
}

// Wishlist Pessoal (Simplificada)
Table personal_wishlist {
id int [pk, increment]
user_id int [ref: > users.id]
restaurant_id int [ref: > restaurants.id]
created_at timestamp 
}