import 'package:loqo_by_aca_mobile/models/product_model.dart';
import 'package:loqo_by_aca_mobile/services/product/remote_product_service.dart';

class ProductRepositories {
  final RemoteProductService _productService;

  ProductRepositories({required RemoteProductService productService})
      : _productService = productService;

  Future<void> createProduct({
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    await _productService.createProduct(
      product: product,
      onSuccess: onSuccess,
      onError: onError,
    );
  }

  Future<void> getAllProducts({
    required Function(List<ProductModel> productList) onSuccess,
    required Function(String? message) onError,
  }) async {
    await _productService.getAllProduct(
      onSuccess: onSuccess,
      onError: onError
    );
  }

  Future<void> updateProduct({
    required String productId,
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    await _productService.updateProduct(
      productId: productId,
      product: product,
      onSuccess: onSuccess,
      onError: onError,
    );
  }
}
