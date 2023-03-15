import 'package:flutter/material.dart';

void showSnackBar(BuildContext context, String text) {
  // dev.log(text, name: "Response Body");
  if (context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
      ),
    );
  }
}
