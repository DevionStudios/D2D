import 'dart:convert';

class Media {
  final String? url;
  final String? mediaType;

  Media(this.url, this.mediaType);

  Map<String, dynamic> toMap() {
    return {
      'url': url ?? '',
      'mediaType': mediaType ?? '',
    };
  }

  factory Media.fromMap(Map<String, dynamic> map) {
    return Media(
      map['url'] ?? '',
      map['mediaType'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory Media.fromJson(String source) => Media.fromMap(json.decode(source));
}
