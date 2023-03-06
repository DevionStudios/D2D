import 'package:flutter/material.dart';

import 'package:foxxi/validator.dart';

class TextFieldWidget extends StatelessWidget {
  final TextEditingController textEditingController;
  final bool isPassword;
  final bool isName;
  final bool isEmail;
  final bool isUsername;
  final String hintText;
  final TextInputType textInputType;
  const TextFieldWidget(
      {Key? key,
      required this.textEditingController,
      this.isEmail = false,
      this.isName = false,
      this.isPassword = false,
      this.isUsername = false,
      required this.hintText,
      required this.textInputType})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final inputBorder =
        OutlineInputBorder(borderSide: Divider.createBorderSide(context));
    return TextFormField(
      validator: isPassword
          ? passwordValidator
          : isEmail
              ? emailValidator
              : isName
                  ? nameValidator
                  : validator,
      controller: textEditingController,
      decoration: InputDecoration(
        hintText: hintText,
        border: inputBorder,
        focusedBorder: inputBorder,
        enabledBorder: inputBorder,
        errorBorder: inputBorder,
        filled: true,
        contentPadding: const EdgeInsets.all(8),
      ),
      keyboardType: textInputType,
      obscureText: isPassword,
    );
  }
}
