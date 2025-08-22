function mockAICall(imageBuffer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          class_id: 0,
          confidence: 0.92,
          xyxy: [123.45, 67.89, 200.12, 150.34],
          xywh: [161.78, 109.11, 76.67, 82.45],
        },
        {
          class_id: 1,
          confidence: 0.85,
          xyxy: [50.23, 30.55, 120.66, 95.88],
          xywh: [85.44, 63.22, 70.43, 65.33],
        },
      ]);
    }, 1000); 
  });
}

module.exports = mockAICall;
