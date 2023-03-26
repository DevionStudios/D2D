import 'dart:convert';

class FoxxiTrendsPost {
  final String text;
  final String created_at;
  FoxxiTrendsPost({
    required this.text,
    required this.created_at,
  });

  Map<String, dynamic> toMap() {
    return {
      'text': text,
      'created_at': created_at,
    };
  }

  factory FoxxiTrendsPost.fromMap(Map<String, dynamic> map) {
    return FoxxiTrendsPost(
      text: map['text'] ?? '',
      created_at: map['created_at'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory FoxxiTrendsPost.fromJson(String source) =>
      FoxxiTrendsPost.fromMap(json.decode(source));
}
