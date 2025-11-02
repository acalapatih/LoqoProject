import 'package:flutter/cupertino.dart';
import 'package:loqo_by_aca_mobile/models/product_model.dart';
import 'package:loqo_by_aca_mobile/services/product/product_repositories.dart';

class ProductViewModel extends ChangeNotifier {
  final ProductRepositories _productRepositories;

  ProductViewModel({required ProductRepositories productRepositories})
      : _productRepositories = productRepositories;

  List<ProductModel>? _productList = [];
  List<ProductModel>? get productList => _productList;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> createProduct({
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    _setLoading(true);
    await _productRepositories.createProduct(
      product: product,
      onSuccess: () {
        onSuccess.call();
        _setLoading(false);
        notifyListeners();
      },
      onError: (message) {
        onError.call(message);
        _setLoading(false);
        notifyListeners();
      },
    );
  }

  Future<void> getAllProducts({
    required Function(String? message) onError,
  }) async {
    _setLoading(true);
    await _productRepositories.getAllProducts(
      onSuccess: (List<ProductModel> productList) {
        _productList = productList;
        _setLoading(false);
        notifyListeners();
      },
      onError: (message) {
        onError.call(message);
        _setLoading(false);
        notifyListeners();
      },
    );
  }

  Future<void> updateProduct({
    required String productId,
    required ProductModel product,
    required Function() onSuccess,
    required Function(String? message) onError,
  }) async {
    _setLoading(true);
    await _productRepositories.updateProduct(
      productId: productId,
      product: product,
      onSuccess: () {
        onSuccess.call();
        _setLoading(false);
        notifyListeners();
      },
      onError: (message) {
        onError.call(message);
        _setLoading(false);
        notifyListeners();
      },
    );
  }
}