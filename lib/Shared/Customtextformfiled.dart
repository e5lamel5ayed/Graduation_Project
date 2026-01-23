import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Customtextformfiled extends StatefulWidget {
  const Customtextformfiled({
    super.key,
    required this.hint,
    required this.isPassword,
    required this.controller,
    required this.label,
    required this.icon,
  });

  final String hint;
  final String label;
  final bool isPassword;
  final IconData icon;
  final TextEditingController controller;

  @override
  State<Customtextformfiled> createState() => _CustomtextformfiledState();
}

class _CustomtextformfiledState extends State<Customtextformfiled> {
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.isPassword;
  }

  void _togglePassword() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomText(
            text: widget.label,
            iscenter: false,
            size: 16.sp,
            weight: FontWeight.w500,
            color: AppColors.titleColor,
          ),

          SizedBox(height: 8.h),

          SizedBox(
            width: double.infinity,
            height: 48.h,
            child: TextFormField(
              controller: widget.controller,
              cursorColor: AppColors.ActiveColor,
              obscureText: _obscureText,
              validator: (v) {
                if (v == null || v.isEmpty) {
                  return 'please fill ${widget.label}';
                }
                return null;
              },
              decoration: InputDecoration(
                hintText: widget.hint,
                hintStyle: TextStyle(
                  color: AppColors.descColor,
                  fontSize: 14.sp,
                ),
                prefixIcon: Icon(
                  widget.icon,
                  color: AppColors.descColor,
                  size: 22.sp,
                ),
                suffix: widget.isPassword ? SizedBox( width:15.w , height: 15.h, child: GestureDetector( onTap: _togglePassword, child: Icon(Icons.remove_red_eye_outlined, size: 24.sp), ), ) : SizedBox( width:15.w , height: 15.h, ), filled: true, fillColor: Colors.white,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide: BorderSide.none,
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide: const BorderSide(color: Colors.red),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide:
                      BorderSide(color: AppColors.ActiveColor, width: 1),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
