import 'dart:convert';
import 'dart:developer';

import 'package:http/http.dart' as http;
import 'package:loqo_by_aca_mobile/constant.dart';
import 'package:loqo_by_aca_mobile/functions.dart';

class RemoteLoginService {

  Future<void> login({
    required String email,
    required String password,
    required Function() onSuccess,
    required Function(String? message) onError
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        body: jsonEncode({"email": email, "password": password}),
        headers: {'Content-Type': 'application/json'},
      );

      log("RESPONSE LOGIN : ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        var data = jsonDecode(response.body);
        final String userToken = data['access_token'];
        saveUserToken(userToken);
        onSuccess.call();
      } else {
        onError.call("Gagal Login");
      }
    } catch (e) {
      onError.call("Gagal Login : ${e.toString()}");
    }
  }
}