import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/Shared/Customtextformfiled.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/auth/widgets/OrDivider.dart';
import 'package:rewarding_kids/features/auth/widgets/applebutton.dart';
import 'package:rewarding_kids/features/auth/widgets/forgetbutton.dart';
import 'package:rewarding_kids/features/auth/widgets/googlebutton.dart';
import 'package:rewarding_kids/features/auth/widgets/underlinetext.dart';

class Loginform extends StatefulWidget {
  const Loginform({super.key});

  @override
  State<Loginform> createState() => _LoginformState();
}

class _LoginformState extends State<Loginform> {
  final formKey = GlobalKey<FormState>();
  late TextEditingController emailController;
  final passController = TextEditingController();

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
  }

  @override
  void dispose() {
    emailController.dispose();
    passController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        children: [
          Customtextformfiled(
            hint: 'example@gmail.com',
            isPassword: false,
            controller: emailController,
            label: 'Email',
            icon: Icons.email_outlined,
          ),
          Customtextformfiled(
            hint: '********',
            isPassword: true,
            controller: passController,
            label: 'Password',
            icon: Icons.lock_outline_rounded,
          ),
          SizedBox(height: 15.h),
          Forgetbutton(),
          SizedBox(height: 20.h),
          Custombutton(
            onPressed: () {
              context.go('/child_name');
            },
            text: 'Sign in',
          ),
          SizedBox(height: 25.h),
          Ordivider(),
          SizedBox(height: 20.h),
          Googlebutton(text: 'Sign in with Google'),
          SizedBox(height: 10.h),
          Applebutton(text: 'Sign in with Apple'),
          SizedBox(height: 20.h),
          Underlinetext(
            text: 'Don’t have an account ?',
            underlinetext: 'sign Up',
            onPressed: () => context.go('/signup'),
          ),
        ],
      ),
    );
  }
}
