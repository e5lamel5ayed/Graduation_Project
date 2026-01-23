import 'dart:async';
import'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/auth/widgets/otpwidget.dart';
import 'package:rewarding_kids/features/auth/widgets/underlinetext.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
class Otp1View extends StatefulWidget {
  const Otp1View({super.key});
  @override
  State<Otp1View> createState() => _Otp1ViewState();
}
class _Otp1ViewState extends State<Otp1View> {
  int _secondsRemaining = 30;
  bool _enableResend = false;
  Timer? _timer;
  final List<TextEditingController> _otpControllers =
  List.generate(4, (_) => TextEditingController());
  @override
  void initState() {
    super.initState();
    startTimer();
  }
  void startTimer() {
    _secondsRemaining = 30;
    _enableResend = false;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining == 0) {
        setState(() {
          _enableResend = true;
        });
        timer.cancel();
      } else {
        setState(() {
          _secondsRemaining--;
        });
      }
    });
  }

  void resendCode() {
    startTimer();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Verification code resent")),
    );
  }


  void verifyCode() {
    String code = _otpControllers.map((e) => e.text).join();

    if (code.length == 4) {

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Verifying code: $code")),
      );


      Future.delayed(const Duration(seconds: 1), () {
        context.go('/resetpass1');
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter full code")),
      );
    }
  }
  @override
  void dispose() {
    for (var c in _otpControllers) {
      c.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: AppColors.Background,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 12.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Popbutton(
                      onPressed: () {
                        if (context.canPop()) {
                          context.pop();
                        } else {
                          context.go('/forgetpass');
                        }
                      },
                    ),
                  ],
                ),
                SizedBox(height: 30.h),
                Center(
                  child: SvgPicture.asset(
                    'assets/icons/email.svg',
                    width: 56.w,
                    height: 56.h,
                  ),
                ),
                SizedBox(height: 20.h),
                CustomText(
                  text: 'Verify email address',
                  iscenter: true,
                  color: AppColors.titleColor,
                  weight: FontWeight.w600,
                  size: 18.sp,
                ),
                SizedBox(height: 10.h),
                CustomText(
                  text: 'Enter verification code sent to',
                  iscenter: true,
                  color: AppColors.titleColor,
                  weight: FontWeight.w400,
                  size: 14.sp,
                ),
                CustomText(
                  text: 'amiraelamir@gmail.com',
                  iscenter: true,
                  color: AppColors.descColor,
                  weight: FontWeight.w400,
                  size: 14.sp,
                ),
                SizedBox(height: 20.h),
                Otpwidget(
                  secondsRemaining: _secondsRemaining,
                  enableResend: _enableResend,
                  otpControllers: _otpControllers,
                ),
                SizedBox(height: 20.h),
                Custombutton(
                  onPressed: verifyCode,
                  text: 'Verify',
                ),
                SizedBox(height: 10.h),
                Center(
                  child: Underlinetext(
                    text: 'OTP not received ?',
                    underlinetext: 'send again',
                    onPressed: _enableResend ? resendCode : null,
                  ),
                ),
                SizedBox(height: 30.h), // مسافة إضافية لتجنب overflow مع الكيبورد
              ],
            ),
          ),
        ),
      ),
    );
  }}
