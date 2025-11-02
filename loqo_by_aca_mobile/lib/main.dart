import 'package:flutter/material.dart';
import 'package:loqo_by_aca_mobile/route_generator.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Loqo App',
      theme: ThemeData(
        primaryColor: Color(0xFFFF7900),
        useMaterial3: true
      ),
      routerConfig: AppRouter.router,
    );
  }
}
