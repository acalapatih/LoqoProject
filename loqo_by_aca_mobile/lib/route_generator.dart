import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:loqo_by_aca_mobile/screen/dashboard/dashboard_screen.dart';
import 'package:loqo_by_aca_mobile/screen/login/login_screen.dart';
import 'package:loqo_by_aca_mobile/services/login/login_repositories.dart';
import 'package:loqo_by_aca_mobile/services/login/remote_login_service.dart';
import 'package:loqo_by_aca_mobile/services/product/product_repositories.dart';
import 'package:loqo_by_aca_mobile/services/product/remote_product_service.dart';
import 'package:loqo_by_aca_mobile/view_models/login/login_view_model.dart';
import 'package:loqo_by_aca_mobile/view_models/product/product_view_model.dart';
import 'package:provider/provider.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: LoginScreen.routeName,
    routes: <RouteBase>[
      GoRoute(
        path: LoginScreen.routeName,
        builder: (BuildContext context, GoRouterState state) {
          return ChangeNotifierProvider(
            create: (context) => LoginViewModel(
              loginRepositories: LoginRepositories(
                  loginService: RemoteLoginService())
            ),
            child: LoginScreen(),
          );
        },
      ),
      GoRoute(
        path: DashboardScreen.routeName,
        builder: (BuildContext context, GoRouterState state) {
          return ChangeNotifierProvider(
            create: (context) => ProductViewModel(
              productRepositories: ProductRepositories(
                  productService: RemoteProductService())
            ),
            child: DashboardScreen(),
          );
        },
      ),
    ],
  );
}