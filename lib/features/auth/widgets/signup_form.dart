import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/Shared/Customtextformfiled.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/auth/widgets/OrDivider.dart';
import 'package:rewarding_kids/features/auth/widgets/applebutton.dart';
import 'package:rewarding_kids/features/auth/widgets/googlebutton.dart';
import 'package:rewarding_kids/features/auth/widgets/underlinetext.dart';

class SignupForm extends StatefulWidget {
  const SignupForm({super.key});

  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {

        final nameController = TextEditingController();
    final emailController = TextEditingController();
    final passController = TextEditingController();
    final confirmController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    
      @override
    
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passController.dispose();
    confirmController.dispose();
    super.dispose();
  }
    @override
  Widget build(BuildContext context) {


    return Form(
      key: formKey,
      child: SingleChildScrollView(
        child: Column(
        //  mainAxisSize: MainAxisSize.min,
          children: [
              Customtextformfiled(
              hint: 'amira reda',
              isPassword: false,
              controller: nameController,
              label: 'Full Name',
              icon: Icons.person_2_outlined,
            ),
            SizedBox(height: 12.h),

      
            Customtextformfiled(
              hint: 'example@gmail.com',
              isPassword: false,
              controller: emailController,
              label: 'Email',
              icon: Icons.email_outlined,
            ),
            SizedBox(height: 12.h),
            Customtextformfiled(
              hint: '********',
              isPassword: true,
              controller: passController,
              label: 'Password',
              icon: Icons.lock_outline_rounded,
            ),
            SizedBox(height: 12.h),
            Customtextformfiled(
              hint: '********',
              isPassword: true,
              controller: confirmController,
              label: 'Confirm Password',
              icon: Icons.lock_outline_rounded,
            ),
            SizedBox(height: 20.h),
            Custombutton(
              onPressed: () => context.go('/login'),
              text: 'Continue',
            ),
            SizedBox(height: 20.h),
            Ordivider(),
            SizedBox(height: 20.h),
            Googlebutton(text: 'Sign up with Google'),
            SizedBox(height: 12.h),
            Applebutton(text: 'Sign up with Apple'),
            SizedBox(height: 20.h),
            Underlinetext(
              text: 'Already have an account?',
              underlinetext: 'Sign in',
              onPressed: () => context.go('/login'),
            ),
          ],
        ),
      ),
    );
  }
}
