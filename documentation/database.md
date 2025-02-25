// A more complete social media schema for GastroWish

Table users {
    id INTEGER [primary key, increment]
    google_id TEXT [unique]
    username TEXT [unique, not null]
    name TEXT [not null]
    email TEXT [not null, unique]
    password_hash TEXT
    phone TEXT
    bio TEXT
    location TEXT
    website TEXT
    favorite_food TEXT[]
    favorite_cuisines TEXT[]
    dietary_preferences TEXT[]
    profile_picture TEXT
    cover_photo TEXT
    is_verified BOOLEAN [default: false]
    is_private BOOLEAN [default: false]
    created_at TIMESTAMP [default: `NOW()`]
    last_login TIMESTAMP
}

Table friendships {
    id INTEGER [primary key, increment]
    requester_id INTEGER [ref: > users.id]
    addressee_id INTEGER [ref: > users.id]
    status TEXT [note: 'pending, accepted, blocked']
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table messages {
    id INTEGER [primary key, increment]
    sender_id INTEGER [ref: > users.id]
    receiver_id INTEGER [ref: > users.id]
    content TEXT
    is_read BOOLEAN [default: false]
    created_at TIMESTAMP [default: `NOW()`]
    deleted_at TIMESTAMP
}

Table restaurants {
    id INTEGER [primary key, increment]
    name TEXT [not null]
    description TEXT
    address TEXT [not null]
    category TEXT[]
    cuisine_type TEXT[]
    service_type TEXT[]
    price_range TEXT
    website TEXT
    phone TEXT
    delivery_available BOOLEAN [default: false]
    opening_hours JSON
    photos TEXT[]
    menu_photos TEXT[]
    latitude REAL
    longitude REAL
    verified_at TIMESTAMP
    created_by INTEGER [ref: > users.id]
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table reviews {
    id INTEGER [primary key, increment]
    restaurant_id INTEGER [ref: > restaurants.id]
    user_id INTEGER [ref: > users.id]
    rating REAL
    food_rating REAL
    service_rating REAL
    ambience_rating REAL
    price_rating REAL
    title TEXT
    content TEXT
    photos TEXT[]
    visit_date DATE
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table posts {
    id INTEGER [primary key, increment]
    user_id INTEGER [ref: > users.id]
    restaurant_id INTEGER [ref: > restaurants.id, null]
    content TEXT
    photos TEXT[]
    location TEXT
    tags TEXT[]
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table comments {
    id INTEGER [primary key, increment]
    post_id INTEGER [ref: > posts.id]
    user_id INTEGER [ref: > users.id]
    parent_comment_id INTEGER [ref: > comments.id, null]
    content TEXT
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table reactions {
    id INTEGER [primary key, increment]
    user_id INTEGER [ref: > users.id]
    target_type TEXT [note: 'post, comment, review']
    target_id INTEGER
    reaction_type TEXT [note: 'like, love, helpful, etc']
    created_at TIMESTAMP [default: `NOW()`]
}

Table collections {
    id INTEGER [primary key, increment]
    user_id INTEGER [ref: > users.id]
    name TEXT
    description TEXT
    is_private BOOLEAN [default: false]
    created_at TIMESTAMP [default: `NOW()`]
    updated_at TIMESTAMP
}

Table collection_items {
    id INTEGER [primary key, increment]
    collection_id INTEGER [ref: > collections.id]
    restaurant_id INTEGER [ref: > restaurants.id]
    notes TEXT
    added_at TIMESTAMP [default: `NOW()`]
}

Table notifications {
    id INTEGER [primary key, increment]
    user_id INTEGER [ref: > users.id]
    type TEXT
    content TEXT
    related_id INTEGER
    is_read BOOLEAN [default: false]
    created_at TIMESTAMP [default: `NOW()`]
}

Table user_achievements {
    id INTEGER [primary key, increment]
    user_id INTEGER [ref: > users.id]
    achievement_type TEXT
    level INTEGER
    earned_at TIMESTAMP [default: `NOW()`]
}

Table hashtags {
    id INTEGER [primary key, increment]
    name TEXT [unique]
    post_count INTEGER [default: 0]
}

Table post_hashtags {
    id INTEGER [primary key, increment]
    post_id INTEGER [ref: > posts.id]
    hashtag_id INTEGER [ref: > hashtags.id]
}