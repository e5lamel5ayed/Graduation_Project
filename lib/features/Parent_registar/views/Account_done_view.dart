import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/services.dart';

import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AccountDoneView extends StatelessWidget {
  const AccountDoneView({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: size.width * 0.07,
            vertical: size.height * 0.03,
          ),
          child: Column(
            children: [
              // زر العودة
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Popbutton(onPressed: () {
                    context.go('/avatar');
                  }),
                ],
              ),SizedBox(height: size.height * 0.15),


              // الصورة
              Center(
                child: SizedBox(
                  height: size.height * 0.15,
                  width: size.width * 0.3,
                  child: Image.asset('assets/icons/done.png'),
                ),
              ),

              SizedBox(height: size.height *0.02),

              // العنوان
              CustomText(
                text: 'Congrats!\nAccount created successfully.',
                iscenter: true,
                color: AppColors.titleColor,
                size: 18.sp,
                weight: FontWeight.w500,
              ),

              SizedBox(height: size.height *0.02),
                

          // QR Code
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12.w,vertical: 12.h),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12.r),
            //  color: Colors.grey.shade200,
            ),
            child: SvgPicture.asset(
              "assets/icons/qrcode.svg",
              height: size.height*0.17,
              width: size.width*0.46,
            ),
          ),
SizedBox(height: size.height *0.02),
              // كود الطفل
              Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CustomText(
                        text: 'Child Code: ',
                        iscenter: true,
                        color: AppColors.titleColor,
                        size: 16.sp,
                        weight: FontWeight.w400,
                      ),
                    SizedBox(width: 10.w,),
                    Text(
"94558932", style: TextStyle(
    decoration: TextDecoration.underline,
    color:AppColors.titleColor,fontSize: 16.sp,fontWeight: FontWeight.w400,
  ),
                      ),
                      GestureDetector(
                        onTap: ()  {
    Clipboard.setData(
      const ClipboardData(text: "94558932"),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Child code copied"),
        duration: Duration(seconds: 2),
      ),
    );
  },
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: SvgPicture.asset(
                            'assets/icons/Copy.svg',
                            width: 20.w,
                            height: 20.h,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: size.height * 0.01),
                  CustomText(
                    text: 'Enter this code on child phone or tablet.',
                    iscenter: true,
                    color: AppColors.descColor,
                    size: 12.sp,
                    weight: FontWeight.w400,
                  ),
                ],
              ),

      Spacer(flex: 1,),

              Custombutton(
                text: "Continue",
                onPressed: () {
                  context.go('/Layout');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
