import 'package:flutter/material.dart';

class TextFieldWidget2 extends StatelessWidget {
  final TextEditingController controller;
  final String? hintText;
  final String headingText;
  const TextFieldWidget2({
    Key? key,
    required this.controller,
    this.hintText,
    required this.headingText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            headingText,
            style: const TextStyle(fontFamily: 'InstagramSans', fontSize: 15),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: TextField(
            controller: controller,
            decoration: InputDecoration(
              border: const OutlineInputBorder(),
              hintText: hintText,
            ),
          ),
        ),
      ],
    );
  }
}
