import 'dart:convert';
import 'utils.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:developer' as dev;

void httpErrorHandle({
  required http.Response response,
  BuildContext? context,
  required VoidCallback onSuccess,
}) {
  switch (response.statusCode) {
    case 201:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      onSuccess();
      break;
    case 200:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      onSuccess();
      break;
    case 400:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      if (context != null) {
        showSnackBar(context, response.body);
      }
      break;
    case 500:
      dev.log(response.body.toString(), name: "Response Status Code");
      if (context != null) {
        showSnackBar(context, response.body);
      }
      break;
    default:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      if (context != null) {
        showSnackBar(context, 'Something went wrong');
      }
  }
}
