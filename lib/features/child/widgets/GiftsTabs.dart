import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/child/data/giftmo_model.dart';
import 'package:rewarding_kids/features/child/widgets/GiftsGrid.dart';
import 'package:rewarding_kids/features/child/widgets/TabItem.dart';
class GiftsTabs extends StatefulWidget {
  const GiftsTabs({super.key});

  @override
  State<GiftsTabs> createState() => _GiftsTabsState();
}

class _GiftsTabsState extends State<GiftsTabs> {
  int selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding:  EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
          child: Container(
          width: double.infinity,        //  height: MediaQuery.of(context).size.height * 0.05,
          // margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Color(0XFFF8F4FA),
              borderRadius: BorderRadius.circular(16.r),
            ),
            child: Row(
              children: [
                TabItem(
                  title: "Gifts from Parent",
                  index: 0,
                  selectedIndex: selectedIndex,
                  onTap: (i) {
                    setState(() {
                      selectedIndex = i;
                    });
                  },
                ),
                TabItem(
                  title: "Store",
                  index: 1,
                  selectedIndex: selectedIndex,
                  onTap: (i) {
                    setState(() {
                      selectedIndex = i;
                    });
                  },
                ),
              ],
            ),
          ),
        ),
Expanded(
            child: selectedIndex == 0
                ? GiftsGrid(gifts: parentgift, buttonText: ' Get Gift', fit: BoxFit.fill,)
                : GiftsGrid(gifts: Storegift, buttonText: 'Buy', fit: BoxFit.contain,),
          ),

        SizedBox(
          height: 50.h,
        )
      ],
    );
  }
}
