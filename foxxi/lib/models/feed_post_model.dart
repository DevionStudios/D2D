import 'dart:convert';

import 'package:foxxi/models/user.dart';

import 'media.dart';

class FeedPostModel {
  final String caption;
  final User author;
  final List<String>? hashtags;
  final List<dynamic>? likes;
  final List<dynamic>? comments;

  final int reposts;
  final Media? media;
  final String? gifLink;
  final String twitterId;
  final List<String>? reports;
  final String originalPostId;
  FeedPostModel({
    required this.caption,
    required this.author,
    this.hashtags,
    this.likes,
    this.comments,
    required this.reposts,
    this.media,
    this.gifLink,
    required this.twitterId,
    this.reports,
    required this.originalPostId,
  });

  Map<String, dynamic> toMap() {
    return {
      'caption': caption,
      'author': author.toMap(),
      'hashtags': hashtags,
      'likes': likes,
      'comments': comments,
      'reposts': reposts,
      'media': media?.toMap(),
      'gifLink': gifLink,
      'twitterId': twitterId,
      'reports': reports,
      'originalPostId': originalPostId,
    };
  }

  factory FeedPostModel.fromMap(Map<String, dynamic> map) {
    return FeedPostModel(
      caption: map['caption'] ?? '',
      author: User.fromMap(map['author']),
      hashtags:
          map['hashtags'] == null ? [] : List<String>.from(map['hashtags']),
      likes: map['likes'] == null ? [] : List<dynamic>.from(map['likes']),
      comments:
          map['comments'] == null ? [] : List<dynamic>.from(map['comments']),
      reposts: map['reposts']?.toInt() ?? 0,
      media: Media.fromMap(map['media']),
      gifLink: map['gifLink'],
      twitterId: map['twitterId'] ?? '',
      reports: map['reports'] == null ? [] : List<String>.from(map['reports']),
      originalPostId: map['originalPostId'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory FeedPostModel.fromJson(String source) =>
      FeedPostModel.fromMap(json.decode(source));
}
