export type LiveFeedOffer = {
  id: number;
  hostName: string;
  originalPrice: number;
  tramonaPrice: number;
  address: string;
  hostPicUrl: string;
  discountPercent: number;
  airbnbUrl: string;
  imageUrl: string;
};

export const liveFeedOffers: LiveFeedOffer[] = [
  {
    id: 1,
    hostName: "Matt",
    originalPrice: 189,
    tramonaPrice: 175,
    discountPercent: 7.4,
    address: "San Luis Obispo",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/c17a3f31-eb92-4246-8388-269eb5dc90d2.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/15345610?source_impression_id=p3_1701656366_gRUFS1PDPs5Q8IZX",
    imageUrl:
      "https://a0.muscache.com/im/pictures/701bfc06-cb5b-4112-9bd5-7cfd72add60c.jpg?im_w=720",
  },
  {
    id: 2,
    hostName: "Tessa",
    originalPrice: 195,
    tramonaPrice: 160,
    discountPercent: 7.4,
    address: "San Luis Obispo",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/29bccc36-bb05-421d-8f95-e88f77158f80.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/673297388052045944?source_impression_id=p3_1701656377_B1GAnJ62dZaMap6l",
    imageUrl:
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-673297388052045944/original/a3b0caf6-b4ca-43d1-95ca-b8d0e4baefa7.jpeg?im_w=720",
  },
  {
    id: 3,
    hostName: "Karina & Brian",
    originalPrice: 250,
    tramonaPrice: 200,
    discountPercent: 20,
    address: "LA",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/b7aa234f-762d-44b8-97c6-1195afe69758.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/557329452695119331?source_impression_id=p3_1701656285_kT4nJC5rg7vyF6Gi",
    imageUrl:
      "https://a0.muscache.com/im/pictures/e079c5c5-7fb6-40d8-955f-0ed2bc8d1a95.jpg?im_w=1200",
  },
  {
    id: 4,
    hostName: "Cali",
    originalPrice: 324,
    tramonaPrice: 220,
    discountPercent: 35.2,
    address: "LA",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-368176988/original/900768ab-a2c2-4846-b805-1a98c1298ccd.jpeg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/823555011062862698?source_impression_id=p3_1701656306_bAmR5wgwhIf1Q8So",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-823555011062862698/original/09286e22-d844-49ac-a781-18529e552fb1.jpeg?im_w=720",
  },
  {
    id: 5,
    hostName: "Paola",
    originalPrice: 375,
    tramonaPrice: 300,
    discountPercent: 20,
    address: "LA",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/95f52f4c-fe75-4584-93b0-f7dcb549a79e.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/52742665?source_impression_id=p3_1701656325_wgYBheKYjbIT%2BS6n",
    imageUrl:
      "https://a0.muscache.com/im/pictures/airflow/Hosting-52742665/original/be053ee1-14c0-4d4b-8b08-e1399be1a68a.jpg?im_w=720",
  },
  {
    id: 6,
    hostName: "Lauren",
    originalPrice: 228,
    tramonaPrice: 200,
    discountPercent: 12.3,
    address: "Bellingham, WA",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/f35251b7-551b-4ce1-a904-e7614d0c292e.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/751755282241588887?source_impression_id=p3_1701656269_7%2F%2FfDTFSx4Q0jEO0",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-722606731615060132/original/163e22ed-5554-45a3-8e78-2171a530295c.jpeg?im_w=1200",
  },
  {
    id: 7,
    hostName: "Innessa",
    originalPrice: 550,
    tramonaPrice: 525,
    discountPercent: 4.5,
    address: "Innessa",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/cd18dc1d-e603-49f8-a297-2942c84e1dd6.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/930492572078552944?source_impression_id=p3_1701656216_%2BHSrrfT%2FhWm6IS2n",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-930492572078552944/original/d6cb2e74-d6a0-4610-a4cd-47d4f4212515.jpeg?im_w=1200",
  },
  {
    id: 8,
    hostName: "Goodnight Stays",
    originalPrice: 304,
    tramonaPrice: 254,
    discountPercent: 16.4,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/2adb7873-4e01-4c67-838a-2294e2fb9ea8.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/998537110548667502?source_impression_id=p3_1701656199_DPdIF2BtB%2FvQSGt7",
    imageUrl:
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-998537110548667502/original/7f00f6b0-d5c1-44a2-ab71-271aad708288.jpeg?im_w=1200",
  },
  {
    id: 9,
    hostName: "Tony",
    originalPrice: 900,
    tramonaPrice: 450,
    discountPercent: 50,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/bae68723-f49b-461d-b0a1-114c1812a45d.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/46894740?source_impression_id=p3_1701656164_ld9tzGa43e9VsSGG&check_in=2024-02-13&guests=1&adults=1&check_out=2024-02-15",
    imageUrl:
      "https://a0.muscache.com/im/pictures/22dfab65-0dfb-41a2-a04e-be00f7a2b986.jpg?im_w=1200",
  },
  {
    id: 10,
    hostName: "Athena",
    originalPrice: 454,
    tramonaPrice: 400,
    discountPercent: 11.89,
    address: "Vail",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/ca4581a1-fb9e-4052-b5ee-0df75dfe21dd.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/779753682983935557?source_impression_id=p3_1701655916_Ugxl2Po2%2FT%2BDZDyz",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-779753682983935557/original/5c8ea6dc-3dcc-4179-8cb6-38690575886a.jpeg?im_w=1200",
  },
  {
    id: 11,
    hostName: "Katherine & Becky",
    originalPrice: 433,
    tramonaPrice: 329,
    discountPercent: 24,
    address: "Vail",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/13449431-7bf8-45f3-ae00-6b8ec6e5c457.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/984197653646972710?source_impression_id=p3_1703314881_F5Fbl10D%2FrbAFk4g",
    imageUrl:
      "https://a0.muscache.com/im/pictures/prohost-api/Hosting-984197653646972710/original/7b5b7407-b3f9-45a0-8240-1d97dae678c8.jpeg?im_w=1200",
  },
  {
    id: 12,
    hostName: "Jeff, Drew and Randy",
    originalPrice: 629,
    tramonaPrice: 566,
    discountPercent: 10,
    address: "Vail",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/eec9f5c0-009d-45ae-9d38-f8f35147be90.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/1028221388888199057?source_impression_id=p3_1701655902_bjP8JCxvbcaVz%2Bc2",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1028221388888199057/original/cda47080-e7c1-4242-bb0a-b6290fd37ce5.jpeg?im_w=1200",
  },
  {
    id: 13,
    hostName: "Scott",
    originalPrice: 388,
    tramonaPrice: 300,
    discountPercent: 22.6,
    address: "Vail",
    hostPicUrl: "",
    airbnbUrl: "https://www.vrbo.com/1460319?unitId=2018904",
    imageUrl:
      "https://images.trvl-media.com/lodging/35000000/34460000/34454600/34454579/566e4217.jpg?impolicy=resizecrop&rw=1200&ra=fit",
  },
  {
    id: 14,
    hostName: "Lauren",
    originalPrice: 225,
    tramonaPrice: 175,
    discountPercent: 22,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/43b1c428-7cb1-4e7e-9f38-b8854f6fb743.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/49921989?source_impression_id=p3_1702328726_8lu%2FnFsBMAfehECZ",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-49921989/original/e466b1c2-e995-4fe9-8a81-f347ae25285f.jpeg?im_w=1200",
  },
  {
    id: 15,
    hostName: "Alana",
    originalPrice: 240,
    tramonaPrice: 175,
    discountPercent: 27.0,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-4357635/original/5ce18f43-c6b4-4c01-8e73-9716a7332a1e.jpeg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/665033417189267559?source_impression_id=p3_1702329658_7DRdzN1YNAG2%2FSpC",
    imageUrl:
      "https://a0.muscache.com/im/pictures/84953fdc-79ae-4c0e-81bd-0079585d6710.jpg?im_w=1200",
  },
  {
    id: 16,
    hostName: "April",
    originalPrice: 324,
    tramonaPrice: 314,
    discountPercent: 3,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/31154320-b50a-41ac-8d24-4e5aa66b890b.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/636870912162325694?source_impression_id=p3_1702329808_RHCaLkYHcp8hY6nm",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-636870912162325694/original/dad003d4-5b8e-4b06-abf9-046e42d6f0b6.jpeg?im_w=720",
  },
  {
    id: 17,
    hostName: "Ryan",
    originalPrice: 200,
    tramonaPrice: 175,
    discountPercent: 12.5,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/982769ab-2c80-47b2-955c-cc90b2a94e14.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/51199719?source_impression_id=p3_1702330259_NHsstGZ%2FpN6DIs9z",
    imageUrl:
      "https://a0.muscache.com/im/pictures/ca851739-0660-4952-8375-086bffcf5481.jpg?im_w=720",
  },
  {
    id: 18,
    hostName: "Kay",
    originalPrice: 208,
    tramonaPrice: 158,
    discountPercent: 24,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-167808404/original/4c22688f-217b-4071-971d-e08afdaa5f82.jpeg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/1018897896677858648?source_impression_id=p3_1702330395_CoigQDA%2Bot1LCxRX",
    imageUrl:
      "https://a0.muscache.com/im/pictures/edee6ea8-2906-49ed-93d5-59c0362641d9.jpg?im_w=1200",
  },
  {
    id: 19,
    hostName: "Cody",
    originalPrice: 249,
    tramonaPrice: 175,
    discountPercent: 30,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/a29c3d3b-48c6-4c6d-8db5-aea6d06ae08d.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/27191489?source_impression_id=p3_1702162657_r5Rj7ZZplUoobFMu&check_in=2023-12-15&guests=1&adults=1&check_out=2023-12-17",
    imageUrl:
      "https://a0.muscache.com/im/pictures/ab971407-ffe2-40aa-8b84-c85b8d7c95b7.jpg?im_w=1200",
  },
  {
    id: 20,
    hostName: "Debra",
    originalPrice: 195,
    tramonaPrice: 175,
    discountPercent: 10.3,
    address: "Paso Robles",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/3248590b-597c-4003-9df1-d900b30ca94c.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/660064365000203124?source_impression_id=p3_1702330632_zECymwLphQRkW3f4",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-660064365000203124/original/387ed2d1-6b5f-4440-bc9b-cff4c9ec361a.jpeg?im_w=1200",
  },
  {
    id: 21,
    hostName: "Isaiah",
    originalPrice: 398,
    tramonaPrice: 300,
    discountPercent: 25,
    address: "San Diego",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-548755770/original/e94d4de6-f151-48af-9458-a5f9948ac731.jpeg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/1036435225189723038?source_impression_id=p3_1702499815_aTrm7ZhNBSunwq48",
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1036435225189723038/original/b855b44a-876a-487e-a950-0fbeb813674b.jpeg?im_w=1200",
  },
  {
    id: 22,
    hostName: "Luis",
    originalPrice: 413,
    tramonaPrice: 297,
    discountPercent: 28.0,
    address: "San Diego",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/dac58576-2d80-41af-be1b-e1ca7b7f41be.jpg?im_w=240",
    airbnbUrl: "https://www.airbnb.com/rooms/13095191",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-13095191/original/14a099bd-98b6-44a8-bb36-4d6bc6dcf062.jpeg?im_w=1200",
  },
  {
    id: 23,
    hostName: "Elegant Stays",
    originalPrice: 475,
    tramonaPrice: 375,
    discountPercent: 21,
    address: "San Diego",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/1f13b84a-0d3e-441d-8690-6e192ded1456.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/40238923?source_impression_id=p3_1702500536_FeWUgWB9iUj3MOmc",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-40238923/original/fd112af7-d0ec-479c-9162-59794e2c1e40.jpeg?im_w=1200",
  },
  {
    id: 24,
    hostName: "Amy & Kim",
    originalPrice: 399,
    tramonaPrice: 360,
    discountPercent: 10,
    address: "San Diego",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/2dad7690-b970-44ee-8ff8-c1315761fe25.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/13701867?source_impression_id=p3_1702500723_8BMN%2FioLAl72WWNT",
    imageUrl:
      "https://a0.muscache.com/im/pictures/bc542318-79a5-4c91-8f4b-3856aa553f35.jpg?im_w=1200",
  },
  {
    id: 25,
    hostName: "Nicole and Jason",
    originalPrice: 475,
    tramonaPrice: 325,
    discountPercent: 32,
    address: "San Diego",
    hostPicUrl:
      "https://a0.muscache.com/im/users/27666201/profile_pic/1429216066/original.jpg?im_w=240",
    airbnbUrl:
      "https://www.airbnb.com/rooms/13466682?source_impression_id=p3_1702507582_4SVvWJcY1KI1MIHf",
    imageUrl:
      "https://a0.muscache.com/im/pictures/b4096605-22e5-4feb-bc0d-924485b1450e.jpg?im_w=1200",
  },
  {
    id: 26,
    hostName: "Laura",
    originalPrice: 339,
    tramonaPrice: 250,
    discountPercent: 26,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/7df83393-250f-4708-ae10-ac2e5c85fec4.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://orbirental-images.s3.amazonaws.com/fcdf7900-3814-4d9b-8abd-8a63d56b4569",
  },
  {
    id: 27,
    hostName: "Jason",
    originalPrice: 377,
    tramonaPrice: 344,
    discountPercent: 9,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/ebcbf6b8-bd93-4b4a-8873-c868092290a8.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-704485193611563872/original/1a85370c-e34c-40a1-acc7-cafd44ee6635.jpeg?im_w=720",
  },
  {
    id: 28,
    hostName: "iTrip",
    originalPrice: 306,
    tramonaPrice: 267,
    discountPercent: 13,
    address: "Nashville",
    hostPicUrl: "",
    airbnbUrl: "",
    imageUrl: "",
  },
  {
    id: 29,
    hostName: "Harley",
    originalPrice: 656,
    tramonaPrice: 400,
    discountPercent: 39,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-70801117/original/6518d4a1-c02d-469c-839a-b3afce00af91.jpeg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1056469100112854699/original/c2cfd4c8-87f7-4d7d-a43a-a157e7c9af66.jpeg?im_w=720",
  },
  {
    id: 30,
    hostName: "Amanda",
    originalPrice: 458,
    tramonaPrice: 360,
    discountPercent: 21,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/e274a0da-6f8b-4634-814c-1cf013befed6.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/43256e6d-6ece-40d1-9c32-9aebe92e2714.jpg?im_w=1200",
  },
  {
    id: 31,
    hostName: "Kelly",
    originalPrice: 399,
    tramonaPrice: 300,
    discountPercent: 24,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-29474549/original/bb16b553-905c-4784-9732-7cf7ce0ab71a.jpeg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/904dba29-4cb0-43fd-b0c4-817f24d72338.jpg?im_w=720",
  },
  {
    id: 32,
    hostName: "Naomi",
    originalPrice: 400,
    tramonaPrice: 338,
    discountPercent: 16,
    address: "Nashville",
    hostPicUrl: "",
    airbnbUrl: "",
    imageUrl:
      "https://hallson.co/wp-content/uploads/2022/09/gdxuzpzoeocnkhzvnwfi-scaled.jpg",
  },
  {
    id: 33,
    hostName: "Sheri & Tony",
    originalPrice: 275,
    tramonaPrice: 225,
    discountPercent: 18,
    address: "Nashville",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/ebcbf6b8-bd93-4b4a-8873-c868092290a8.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/881f0a02-60bc-4889-88d1-bace713818ea.jpg?im_w=1200",
  },
  {
    id: 34,
    hostName: "Cirilo",
    originalPrice: 384,
    tramonaPrice: 275,
    discountPercent: 28,
    address: "Sayulita",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/06faded1-4169-4015-9d36-74aceadae47e.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/7637ebdb-b608-494b-93f6-90776d19d87c.jpg?im_w=1200",
  },
  {
    id: 35,
    hostName: "Arantza",
    originalPrice: 377,
    tramonaPrice: 175,
    discountPercent: 53,
    address: "Sayulita",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/8c11bd7e-f5e7-4e36-8649-b473bc1a04a3.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1067403559867848433/original/9875e283-a436-4506-8181-c5767414c76e.jpeg?im_w=1200",
  },
  {
    id: 36,
    hostName: "Montsserrat",
    originalPrice: 373,
    tramonaPrice: 200,
    discountPercent: 46,
    address: "Sayulita",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-541448800/original/40bbaaeb-5904-43ce-bfcf-63fb15920056.jpeg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1000894801403181490/original/f240306a-7b1c-4fd7-9306-871d14f58b4a.jpeg?im_w=1200",
  },
  {
    id: 37,
    hostName: "Peter",
    originalPrice: 484,
    tramonaPrice: 367,
    discountPercent: 24,
    address: "Killington Ski Resort",
    hostPicUrl: "",
    airbnbUrl: "",
    imageUrl:
      "https://www.killingtongroup.com/unitimages/13332/Floor%2BPlan-Living%2BRoom-_DSC5064.JPG",
  },
  {
    id: 38,
    hostName: "Ali",
    originalPrice: 168,
    tramonaPrice: 132,
    discountPercent: 21,
    address: "Vancouver, BC",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-376650581/original/5f46e71f-1689-4d42-a017-1e408cc30e04.jpeg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-992217901200896993/original/de5e6e8a-d437-4005-89e7-1b3b1498fdfa.jpeg?im_w=1200",
  },
  {
    id: 39,
    hostName: "Chen",
    originalPrice: 202,
    tramonaPrice: 175,
    discountPercent: 14,
    address: "Vancouver, BC",
    hostPicUrl:
      "https://a0.muscache.com/im/users/24147121/profile_pic/1416927782/original.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-707199221280154887/original/9753ff12-4841-4aab-bb97-0ef8745da523.jpeg?im_w=1200",
  },
  {
    id: 40,
    hostName: "Shylo",
    originalPrice: 206,
    tramonaPrice: 160,
    discountPercent: 18,
    address: "Vancouver, BC",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/User-522258241/original/d695bcd2-99a9-44ab-b689-cb1a9d7edf4e.jpeg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/4e1a1891-2e14-4be0-9545-e4bcbc52d77f.jpg?im_w=1200",
  },
  {
    id: 41,
    hostName: "Mckenzie & Jeffrey",
    originalPrice: 232,
    tramonaPrice: 190,
    discountPercent: 18,
    address: "Vancouver, BC",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/c6db26ae-24e9-4e20-a008-cca30ee4e1a1.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/miso/Hosting-1003745090356162116/original/a4109071-e70e-4069-9671-1c7843333482.jpeg?im_w=720",
  },
  {
    id: 42,
    hostName: "Elizabeth",
    originalPrice: 250,
    tramonaPrice: 200,
    discountPercent: 20,
    address: "Sugarbush",
    hostPicUrl:
      "https://a0.muscache.com/im/pictures/user/78cdc7e4-e600-4f31-b8bf-02579d304377.jpg?im_w=240",
    airbnbUrl: "",
    imageUrl:
      "https://a0.muscache.com/im/pictures/33f5e7eb-07d3-4190-92f4-1907e015800f.jpg?im_w=1200",
  },
];
