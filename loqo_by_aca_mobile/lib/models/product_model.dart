class ProductModel {
  String? id;
  String? name;
  String? category;
  String? description;
  int? price;
  int? stock;
  String? stockUnit;
  bool? isActive;
  int? lowStockThreshold;
  String? lowStockUnit;
  String? imageUrl;
  String? createdAt;
  String? updatedAt;
  bool? isLowStock;

  ProductModel({
    this.id,
    this.name,
    this.category,
    this.description,
    this.price,
    this.stock,
    this.stockUnit,
    this.isActive,
    this.lowStockThreshold,
    this.lowStockUnit,
    this.imageUrl,
    this.createdAt,
    this.updatedAt,
    this.isLowStock,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String?,
      name: json['name'] as String?,
      category: json['category'] as String?,
      description: json['description'] as String?,
      price: json['price'] as int?,
      stock: json['stock'] as int?,
      stockUnit: json['stock_unit'] as String?,
      isActive: json['is_active'] as bool?,
      lowStockThreshold: json['low_stock_threshold'] as int?,
      lowStockUnit: json['low_stock_unit'] as String?,
      imageUrl: json['image_url'] as String?,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
      isLowStock: json['is_low_stock'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'price': price,
      'stock': stock,
      'stock_unit': stockUnit,
      'is_active': isActive,
      'low_stock_threshold': lowStockThreshold,
      'low_stock_unit': lowStockUnit,
      'image_url': imageUrl,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'is_low_stock': isLowStock,
    };
  }
}