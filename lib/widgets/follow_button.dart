import 'package:flutter/material.dart';

class FollowButton extends StatelessWidget {
  final VoidCallback function;
  final Color backgroundColor;
  final Color borderColor;
  String? text;
  final Color textColor;
  FollowButton(
      {Key? key,
      required this.backgroundColor,
      required this.borderColor,
      this.text,
      required this.textColor,
      required this.function})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Container(
      padding: const EdgeInsets.only(top: 2),
      child: TextButton(
        onPressed: function,
        child: Container(
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: backgroundColor,
            border: Border.all(
              color: borderColor,
            ),
            borderRadius: BorderRadius.circular(5),
          ),
          alignment: Alignment.center,
          height: 27,
          child: Text(
            text.toString(),
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    ));
  }
}
