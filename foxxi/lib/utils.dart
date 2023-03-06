import 'package:flutter/material.dart';

void showSnackBar(BuildContext context, String text) {
  // dev.log(text, name: "Response Body");
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(text),
    ),
  );
}
