class TaskModel{
  final String TaskTitle;
  final String TaskDesc;
  final String image;
  final int point;
  final bool issound;
  final bool isimage;
  TaskModel({required this.TaskTitle, required this.image,  required this.point,
   required this.TaskDesc, required this.issound, required this.isimage, });
}
List<TaskModel>GeneralTasks=[
  TaskModel(TaskTitle: 'Brush your teeth', image: "assets/child/brushteeth.jpg", point: 40, TaskDesc: ' Can you Brush your teeth', issound: false, isimage: true),
  TaskModel(TaskTitle: 'Say the days of the week in order', image: 'assets/child/thedays.jpg', point: 40, TaskDesc:' Can you say all the days of the week? Let’s hear you!' , issound: true, isimage: false),
  TaskModel(TaskTitle: 'Recite Surah Al-Fatiha', image: 'assets/child/quran.jpg', point: 40, TaskDesc: 'Make a craft Learn by creating — every craft teaches something new!', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Make crafts', image: 'assets/child/crafts.jpg', point: 20, TaskDesc: 'Make a craft Learn by creating — every craft teaches something new!', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Do exercise', image: 'assets/child/doexercise.jpg', point: 20, TaskDesc: 'Can you Do exercise ', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Water the flowers', image: 'assets/child/waterflowers.jpg', point: 20, TaskDesc: 'Can you Water the flowers ', issound: false, isimage: true),
  TaskModel(TaskTitle: 'Brush your teeth', image: "assets/child/brushteeth.jpg", point: 40, TaskDesc: ' Can you Brush your teeth', issound: false, isimage: true),
  TaskModel(TaskTitle: 'Recite Surah Al-Fatiha', image: 'assets/child/quran.jpg', point: 40, TaskDesc: 'Make a craft Learn by creating — every craft teaches something new!', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Make crafts', image: 'assets/child/crafts.jpg', point: 20, TaskDesc: 'Make a craft Learn by creating — every craft teaches something new!', issound: false, isimage: false),

];
List<TaskModel>ParentTasks=[
  TaskModel(TaskTitle:'Do math homework' , image: 'assets/child/mathhomework.jpg', point: 50, TaskDesc: ' Can you Do math homework', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Draw a flower', image: 'assets/child/drawflower.jpg', point: 30, TaskDesc: ' Can you Draw a flower', issound: false, isimage: true),
  TaskModel(TaskTitle: 'Do math homework', image: 'assets/child/mathhomework.jpg', point: 50, TaskDesc: ' Can you Draw a flower', issound: false, isimage: false),
  TaskModel(TaskTitle: 'Draw a flower', image: 'assets/child/drawflower.jpg', point: 30, TaskDesc: ' Can you Do math homework', issound: false, isimage: true),

];

