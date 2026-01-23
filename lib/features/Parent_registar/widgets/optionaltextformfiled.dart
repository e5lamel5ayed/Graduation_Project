import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Optionaltextformfiled extends StatefulWidget {
  const Optionaltextformfiled({
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
  State<Optionaltextformfiled> createState() => _OptionaltextformfiledState();
}

class _OptionaltextformfiledState extends State<Optionaltextformfiled> {
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
          Row(
            children: [
              CustomText(
                text: widget.label,
                iscenter: false,
                size: 16.sp,
                weight: FontWeight.w500,
                color: AppColors.titleColor,
              ),
              SizedBox(width: 5.w),
              CustomText(
                text: '(Optional)',
                iscenter: false,
                size: 14.sp,
                weight: FontWeight.w400,
                color: const Color(0xff5C5163),
              ),
            ],
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
                // Optional field: validation only if not empty
                return null;
              },
              decoration: InputDecoration(
                hintText: widget.hint,
                hintStyle: TextStyle(
                  color: AppColors.descColor,
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w400,
                ),
                prefixIcon: Icon(widget.icon,
                    color: AppColors.descColor, size: 22.sp),
                suffixIcon: widget.isPassword
                    ? IconButton(
                        onPressed: _togglePassword,
                        icon: Icon(
                          _obscureText
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                      )
                    : null,
                filled: true,
                fillColor: Colors.white,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide:
                      BorderSide(color: AppColors.ActiveColor, width: 1),
                ),
                errorBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.r),
                  borderSide: const BorderSide(color: Colors.red),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
