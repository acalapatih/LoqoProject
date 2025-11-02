import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:loqo_by_aca_mobile/screen/dashboard/dashboard_screen.dart';
import 'package:loqo_by_aca_mobile/screen/widgets/logo_widget.dart';
import 'package:loqo_by_aca_mobile/view_models/login/login_view_model.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  static const routeName = '/login';

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Padding(
        padding: EdgeInsets.fromLTRB(16, 40, 16, 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LogoWidget(),
            SizedBox.square(dimension: 12),
            Text(
              "Enter your username and password correctly",
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Color(0xFF5B5C63)
              ),
            ),
            SizedBox.square(dimension: 32),
            Text(
              "Email",
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Color(0xFF050506)
              ),
            ),
            SizedBox.square(dimension: 8),
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 12),
                hintText: "Enter email",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                    color: Color(0XFFE6E9F0)
                  )
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
              ),
            ),
            SizedBox.square(dimension: 20),
            Text(
              "Password",
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Color(0xFF050506)
              ),
            ),
            SizedBox.square(dimension: 8),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(
                contentPadding: EdgeInsets.symmetric(horizontal: 12),
                hintText: "Enter Username",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                    color: Color(0XFFE6E9F0)
                  )
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(
                      color: Color(0XFFE6E9F0)
                  )
                ),
                suffixIcon: IconButton(
                  onPressed: () {

                  },
                  icon: Icon(
                    PhosphorIconsRegular.eye,
                    size: 20,
                  ),
                )
              ),
            ),
            SizedBox.square(dimension: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  context.read<LoginViewModel>().login(
                    email: _emailController.text,
                    password: _passwordController.text,
                    onSuccess: () {
                      context.push(
                        DashboardScreen.routeName
                      );
                    },
                    onError: (message) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(message.toString()))
                      );
                    }
                  );
                },
                style: FilledButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)
                  ),
                  backgroundColor: Color(0xFFFF7900)
                ),
                child: Text(
                  "Sign In"
                )
              ),
            )
          ],
        ),
      ),
    );
  }
}
