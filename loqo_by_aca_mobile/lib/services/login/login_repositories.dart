import 'package:loqo_by_aca_mobile/services/login/remote_login_service.dart';

class LoginRepositories {
  final RemoteLoginService _loginService;

  LoginRepositories({required RemoteLoginService loginService})
    : _loginService = loginService;

  Future<void> login({
    required String email,
    required String password,
    required Function() onSuccess,
    required Function(String? message) onError
  }) async {
    await _loginService.login(
      email: email,
      password: password,
      onSuccess: onSuccess,
      onError: onError
    );
  }
}