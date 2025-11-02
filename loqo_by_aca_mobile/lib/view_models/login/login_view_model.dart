import 'package:flutter/material.dart';
import 'package:loqo_by_aca_mobile/services/login/login_repositories.dart';

class LoginViewModel extends ChangeNotifier {
  final LoginRepositories _loginRepositories;

  LoginViewModel({required LoginRepositories loginRepositories})
    : _loginRepositories = loginRepositories;

  Future<void> login({
    required String email,
    required String password,
    required Function() onSuccess,
    required Function(String? message) onError
  }) async {
    await _loginRepositories.login(
      email: email,
      password: password,
      onSuccess: () {
        onSuccess.call();
        notifyListeners();
      },
      onError: (message) {
        onError.call("Gagal Login");
        notifyListeners();
      }
    );
  }
}