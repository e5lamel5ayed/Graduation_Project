import'package:flutter/material.dart';
class FirstView extends StatelessWidget {
  const FirstView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blueAccent,
        title: Center(child: Text("Rewarding Kids System",style: TextStyle(color: Colors.white,fontSize:20 ))),
      ),
    );
  }
}
