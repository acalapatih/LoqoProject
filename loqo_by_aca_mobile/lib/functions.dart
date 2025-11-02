import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'constant.dart';

Future<bool> saveUserToken(String token) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.setString(userToken, token);
  } catch (e) {
    debugPrint('Error saving token: $e');
    return false;
  }
}

Future<String?> getUserToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(userToken);
  } catch (e) {
    debugPrint('Error getting token: $e');
    return null;
  }
}

Future<bool> deleteUserToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.remove(userToken);
  } catch (e) {
    debugPrint('Error deleting token: $e');
    return false;
  }
}