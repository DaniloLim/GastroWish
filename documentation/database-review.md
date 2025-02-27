// Database schema for GastroWish - A Restaurant-focused Social Media Platform

Table users {
  id INTEGER [primary key, increment] // Unique identifier for each user
  google_id TEXT [unique] // Google OAuth ID for social login
  username TEXT [unique, not null] // Unique username for @mentions and profile URLs
  name TEXT [not null] // User's full name
  email TEXT [not null, unique] // User's email address for notifications and login
  phone TEXT // Contact number (optional)
  bio TEXT // User's self-description/about me
  location TEXT // User's city/country
  website TEXT // User's personal/professional website
  favorite_food TEXT[] // Array of favorite dishes
  favorite_cuisines TEXT[] // Array of preferred cuisine types
  dietary_preferences TEXT[] // Array of dietary restrictions/preferences (vegan, halal, etc.)
  profile_picture TEXT // URL to profile image
  cover_photo TEXT // URL to profile header image
  is_verified BOOLEAN [default: false] // Badge for verified accounts
  is_private BOOLEAN [default: false] // Twitter-style private profile setting
  follower_count INTEGER [default: 0] // Number of followers
  following_count INTEGER [default: 0] // Number of accounts following
  account_status TEXT [default: "active"] // Account status
  created_at TIMESTAMP [default: `now()`] // Account creation timestamp
  last_login TIMESTAMP // Last session timestamp
}

Table follows {
  id INTEGER [primary key, increment] // Unique identifier for each follow relationship
  follower_id INTEGER // User who is following
  followed_id INTEGER // User being followed
  status TEXT [default: "accepted"] // Status: "pending" or "accepted"
  created_at TIMESTAMP [default: `now()`] // When the follow request was sent
  updated_at TIMESTAMP // When the status was last updated
}

Table messages {
  id INTEGER [primary key, increment] // Unique identifier for each message
  sender_id INTEGER // User sending the message
  receiver_id INTEGER // User receiving the message
  content TEXT // Message content
  message_type TEXT [default: "text"] // Type of message
  is_read BOOLEAN [default: false] // Message read status
  created_at TIMESTAMP [default: `now()`] // When message was sent
  deleted_at TIMESTAMP // Soft delete timestamp
}

Table restaurants {
  id INTEGER [primary key, increment] // Unique identifier for each restaurant
  name TEXT [not null] // Restaurant name
  description TEXT // Restaurant description/about
  address TEXT [not null] // Physical address
  category TEXT[] // Array of restaurant categories (fine dining, casual, etc.)
  cuisine_type TEXT[] // Array of cuisine stydineles (Italian, Japanese, etc.)
  price_range TEXT // Price category ($, $$, $$$, etc.)
  features TEXT[] // Array of features like Michelin Stars, panoramic view
  website TEXT // Restaurant's website
  phone TEXT // Contact number
  delivery_available BOOLEAN [default: false] // Delivery service availability
  photos TEXT[] // Array of restaurant photos
  menu_photos TEXT[] // Array of menu photos
  average_rating REAL [default: 0] // Computed average rating
  review_count INTEGER [default: 0] // Number of reviews
  latitude REAL // Location coordinates for mapping
  longitude REAL // Location coordinates for mapping
  verified_at TIMESTAMP // When restaurant was verified by admin
  approved_by TIMESTAMP // Who approve the restaurant to be added
  created_by INTEGER // User who added the restaurant
  created_at TIMESTAMP [default: `now()`] // When entry was created
  updated_at TIMESTAMP // Last update timestamp
}


Table restaurant_hours {
  id INTEGER [pk, increment] // Identificador único da entrada
  restaurant_id INTEGER [ref: > restaurants.id] // Referência ao restaurante
  day_of_week TEXT // Dia da semana (ex: "segunda", "terça")
  open_time TIME // Horário de abertura
  close_time TIME // Horário de fechamento
}

Table reviews {
  id INTEGER [primary key, increment] // Unique identifier for each review
  restaurant_id INTEGER // Restaurant being reviewed
  user_id INTEGER // User writing the review
  rating REAL // Overall rating
  food_rating REAL // Food quality rating
  service_rating REAL // Service quality rating
  ambience_rating REAL // Atmosphere rating
  price_rating REAL // Value for money rating
  title TEXT // Review title/summary
  content TEXT // Detailed review
  photos TEXT[] // Array of review photos
  visit_date DATE // When user visited the restaurant
  likes INTEGER [default: 0] // Computed from like reactions
  created_at TIMESTAMP [default: `now()`] // When review was posted
  updated_at TIMESTAMP // Last edit timestamp
}

/*
Table posts {
  id INTEGER [primary key, increment] // Unique identifier for each post
  user_id INTEGER // User who created the post
  restaurant_id INTEGER // Tagged restaurant (optional)
  content TEXT // Post text content
  photos TEXT[] // Array of post photos
  location TEXT // Location tag
  tags TEXT[] // Array of user tags
  post_type TEXT [default: "regular"] // Type of post
  created_at TIMESTAMP [default: `now()`] // Post creation timestamp
  updated_at TIMESTAMP // Last edit timestamp
}

Table comments {
  id INTEGER [primary key, increment] // Unique identifier for each comment
  post_id INTEGER // Post being commented on
  user_id INTEGER // User making the comment
  parent_comment_id INTEGER // Parent comment for nested replies
  content TEXT // Comment text
  created_at TIMESTAMP [default: `now()`] // Comment timestamp
  updated_at TIMESTAMP // Last edit timestamp
}

Table reactions {
  id INTEGER [primary key, increment] // Unique identifier for each reaction
  user_id INTEGER // User who reacted
  target_type TEXT // What was reacted to
  target_id INTEGER // ID of the target content
  reaction_type TEXT // Type of reaction
  created_at TIMESTAMP [default: `now()`] // Reaction timestamp
}
*/

Table collections {
  id INTEGER [primary key, increment] // Unique identifier for each collection
  user_id INTEGER // Collection owner
  name TEXT // Collection name
  description TEXT // Collection description
  is_private BOOLEAN [default: false] // Collection privacy setting
  cover_image TEXT // Collection cover image
  item_count INTEGER [default: 0] // Number of items in collection
  created_at TIMESTAMP [default: `now()`] // Creation timestamp
  updated_at TIMESTAMP // Last update timestamp
}

Table collection_items {
  id INTEGER [primary key, increment] // Unique identifier for each collection item
  collection_id INTEGER // Parent collection
  restaurant_id INTEGER // Saved restaurant
  notes TEXT // Personal notes about the restaurant
  added_at TIMESTAMP [default: `now()`] // When restaurant was added
}

// Completed notifications table
Table notifications {
  id INTEGER [primary key, increment] // Unique identifier for each notification
  user_id INTEGER // User receiving the notification
  sender_id INTEGER // User who triggered the notification
  notification_type TEXT // Type of notification
  content TEXT // Notification message
  target_type TEXT // What the notification relates to
  target_id INTEGER // ID of the related object
  is_read BOOLEAN [default: false] // Read status
  created_at TIMESTAMP [default: `now()`] // When notification was created
}

// New table for content reporting
Table reports {
  id INTEGER [primary key, increment] // Unique identifier for each report
  reporter_id INTEGER // User making the report
  target_type TEXT // Type of content being reported
  target_id INTEGER // ID of reported content
  reason TEXT // Reason for reporting
  details TEXT // Additional information provided by reporter
  status TEXT [default: "pending"] // Report status
  reviewed_by INTEGER // Admin who reviewed the report
  reviewed_at TIMESTAMP // When the report was reviewed
  created_at TIMESTAMP [default: `now()`] // When the report was submitted
}

// Admin role management
Table admin_roles {
  id INTEGER [primary key, increment] // Unique identifier for each role
  name TEXT [unique, not null] // Role name (admin, moderator, etc.)
  description TEXT // Role description
  permissions JSON // Permissions associated with the role
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
}

Table user_admin_roles {
  id INTEGER [primary key, increment]
  user_id INTEGER // User assigned to role
  role_id INTEGER // Assigned role
  assigned_by INTEGER // Who assigned the role
  assigned_at TIMESTAMP [default: `now()`] // When role was assigned
  expires_at TIMESTAMP // Optional expiration (null means never)
}

Table admin_logs {
  id INTEGER [primary key, increment] // Unique identifier for each admin action
  admin_id INTEGER // Admin who performed the action
  action_type TEXT // Type of admin action
  target_type TEXT // Type of affected entity
  target_id INTEGER // ID of affected entity
  previous_state JSON // Previous state before change (if applicable)
  new_state JSON // New state after change (if applicable)
  reason TEXT // Justification for the action
  ip_address TEXT // Admin's IP address
  created_at TIMESTAMP [default: `now()`] // When action occurred
}

// References - Regular foreign key relationships
Ref: follows.follower_id > users.id
Ref: follows.followed_id > users.id
Ref: messages.sender_id > users.id
Ref: messages.receiver_id > users.id
Ref: restaurants.created_by > users.id
Ref: reviews.restaurant_id > restaurants.id
Ref: reviews.user_id > users.id
/*
Ref: posts.user_id > users.id
Ref: posts.restaurant_id > restaurants.id
Ref: comments.post_id > posts.id
Ref: comments.user_id > users.id
Ref: comments.parent_comment_id > comments.id
Ref: reactions.user_id > users.id
*/
Ref: collections.user_id > users.id
Ref: collection_items.collection_id > collections.id
Ref: collection_items.restaurant_id > restaurants.id
Ref: notifications.user_id > users.id
Ref: notifications.sender_id > users.id
Ref: reports.reporter_id > users.id
Ref: reports.reviewed_by > users.id
Ref: user_admin_roles.user_id > users.id
Ref: user_admin_roles.role_id > admin_roles.id
Ref: user_admin_roles.assigned_by > users.id
Ref: admin_logs.admin_id > users.id