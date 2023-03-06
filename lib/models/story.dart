import 'dart:convert';

import 'package:foxxi/models/media.dart';
import 'package:foxxi/models/user.dart';

class Story {
  final String caption;
  final User author;
  final DateTime updatedOn;
  final DateTime createdAt;
  final Media media;
  bool? isSeen;
  Story({
    required this.caption,
    required this.author,
    required this.updatedOn,
    required this.createdAt,
    required this.media,
    this.isSeen = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'caption': caption,
      'author': author.toMap(),
      'updatedOn': updatedOn.millisecondsSinceEpoch,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'media': media.toMap(),
    };
  }

  factory Story.fromMap(Map<String, dynamic> map) {
    return Story(
      caption: map['caption'] ?? '',
      author: User.fromMap(map['author']),
      updatedOn: DateTime.fromMillisecondsSinceEpoch(map['updatedOn']),
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['createdAt']),
      media: Media.fromMap(map['media']),
    );
  }

  String toJson() => json.encode(toMap());

  factory Story.fromJson(String source) => Story.fromMap(json.decode(source));
}
