import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

void showSnackBar(BuildContext context, String text) {
  // dev.log(text, name: "Response Body");
  Fluttertoast.showToast(msg: text);
}

class Items {
  static const items = [
    'Your Feed',
    'Trending',
    'Foxxi Trends',
  ];

  static const List<IconData> icons = [
    Icons.trending_up_outlined,
    Icons.local_fire_department,
    Icons.person_outline_sharp,
  ];
}
