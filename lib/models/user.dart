import 'dart:convert';

class User {
  final String id;
  final String email;
  final String name;
  final String username;
  final String password;
  final String walletAddress;
  final bool hasClaimed;
  final String image;
  final String? coverImage;
  final String bio;
  final List<dynamic>? followers;
  final List<dynamic>? following;
  final List<String> hashtagsfollowed;
  final List<dynamic>? posts;
  final List<dynamic>? stories;
  final String twitterUsername;
  final String accountWallet;
  final List<String> reports;
  final bool isBanned;
  final List<String> preferences;
  User({
    required this.id,
    required this.email,
    required this.name,
    required this.username,
    required this.password,
    required this.walletAddress,
    required this.hasClaimed,
    required this.image,
    this.coverImage,
    required this.bio,
    this.followers,
    this.following,
    required this.hashtagsfollowed,
    this.posts,
    this.stories,
    required this.twitterUsername,
    required this.accountWallet,
    required this.reports,
    required this.isBanned,
    required this.preferences,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'username': username,
      'password': password,
      'walletAddress': walletAddress,
      'hasClaimed': hasClaimed,
      'image': image,
      'coverImage': coverImage,
      'bio': bio,
      'followers': followers,
      'following': following,
      'hashtagsfollowed': hashtagsfollowed,
      'posts': posts,
      'stories': stories,
      'twitterUsername': twitterUsername,
      'accountWallet': accountWallet,
      'reports': reports,
      'isBanned': isBanned,
      'preferences': preferences,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] ?? '',
      email: map['email'] ?? '',
      name: map['name'] ?? '',
      username: map['username'] ?? '',
      password: map['password'] ?? '',
      walletAddress: map['walletAddress'] ?? '',
      hasClaimed: map['hasClaimed'] ?? false,
      image: map['image'] ?? '',
      coverImage: map['coverImage'] ?? '',
      bio: map['bio'] ?? '',
      followers:
          map['followers'] == null ? [] : List<dynamic>.from(map['followers']),
      following:
          map['following'] == null ? [] : List<dynamic>.from(map['following']),
      hashtagsfollowed: List<String>.from(map['hashtagsfollowed']),
      posts: map['posts'] == null ? [] : List<dynamic>.from(map['posts']),
      stories:
          map['stories'] == false ? [] : List<dynamic>.from(map['stories']),
      twitterUsername: map['twitterUsername'] ?? '',
      accountWallet: map['accountWallet'] ?? '',
      reports: List<String>.from(map['reports']),
      isBanned: map['isBanned'] ?? false,
      preferences: List<String>.from(map['preferences']),
    );
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));
}
