import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:loqo_by_aca_mobile/models/product_model.dart';
import '../../constant.dart';

class RemoteProductService {
  Future<void> createProduct({
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/products'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(product.toJson()),
      );

      log("RESPONSE CREATE PRODUCT : ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        onSuccess.call();
      } else {
        String? message;
        try {
          final decoded = jsonDecode(response.body);
          message = decoded['message']?.toString();
        } catch (_) {
          message = response.reasonPhrase;
        }
        onError.call("Gagal menambahkan produk: $message");
      }
    } catch (e) {
      onError.call("Gagal menambahkan produk: ${e.toString()}");
    }
  }

  Future<void> getAllProduct({
    required Function(List<ProductModel> productList) onSuccess,
    required Function(String? message) onError,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/products?page=1&limit=10'),
        headers: {'Content-Type': 'application/json'},
      );

      log("RESPONSE GET ALL PRODUCT : ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        final decoded = jsonDecode(response.body);

        if (decoded['data'] != null && decoded['data'] is List) {
          final List<ProductModel> productList = (decoded['data'] as List)
              .map((item) => ProductModel.fromJson(item))
              .toList();

          onSuccess.call(productList);
        } else {
          onError.call("Data produk tidak ditemukan");
        }
      } else {
        String? message;
        try {
          final decoded = jsonDecode(response.body);
          message = decoded['message']?.toString();
        } catch (_) {
          message = response.reasonPhrase;
        }
        onError.call("Gagal menampilkan daftar produk: $message");
      }
    } catch (e) {
      onError.call("Gagal menampilkan daftar produk: ${e.toString()}");
    }
  }

  Future<void> updateProduct({
    required String productId,
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/products/$productId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(product.toJson()),
      );

      log("RESPONSE UPDATE PRODUCT : ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        onSuccess.call();
      } else {
        String? message;
        try {
          final decoded = jsonDecode(response.body);
          message = decoded['message']?.toString();
        } catch (_) {
          message = response.reasonPhrase;
        }
        onError.call("Gagal memperbarui produk: $message");
      }
    } catch (e) {
      onError.call("Gagal memperbarui produk: ${e.toString()}");
    }
  }
}
