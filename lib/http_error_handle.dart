import 'utils.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:developer' as dev;

void httpErrorHandle({
  required http.Response response,
  required BuildContext context,
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
    case 204:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      onSuccess();
      break;
    case 400:
      dev.log(response.statusCode.toString(), name: "Response Status Code");

      break;
    case 500:
      dev.log(response.body.toString(), name: "Response Status Code");
      break; 
    case 501:
      dev.log(response.body.toString(), name: "Response Status Code");

      break;
    default:
      dev.log(response.statusCode.toString(), name: "Response Status Code");
      showSnackBar(context, 'Something went wrong');
  }
}
