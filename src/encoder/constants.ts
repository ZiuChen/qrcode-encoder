import type { VersionECInfo } from './types'

// ECC-M 各版本块配置 (ISO 18004 Table 9)
export const VERSION_EC_TABLE: VersionECInfo[] = [
  { totalCodewords: 0, groups: [] }, // V0 placeholder
  { totalCodewords: 26, groups: [{ count: 1, dataCodewords: 16 }] }, // V1
  { totalCodewords: 44, groups: [{ count: 1, dataCodewords: 28 }] }, // V2
  { totalCodewords: 70, groups: [{ count: 1, dataCodewords: 44 }] }, // V3
  { totalCodewords: 100, groups: [{ count: 2, dataCodewords: 32 }] }, // V4
  { totalCodewords: 134, groups: [{ count: 2, dataCodewords: 43 }] }, // V5
  { totalCodewords: 172, groups: [{ count: 4, dataCodewords: 27 }] }, // V6
  { totalCodewords: 196, groups: [{ count: 4, dataCodewords: 31 }] }, // V7
  {
    totalCodewords: 242,
    groups: [
      { count: 2, dataCodewords: 38 },
      { count: 2, dataCodewords: 39 }
    ]
  }, // V8
  {
    totalCodewords: 292,
    groups: [
      { count: 3, dataCodewords: 36 },
      { count: 2, dataCodewords: 37 }
    ]
  }, // V9
  {
    totalCodewords: 346,
    groups: [
      { count: 4, dataCodewords: 43 },
      { count: 1, dataCodewords: 44 }
    ]
  }, // V10
  {
    totalCodewords: 404,
    groups: [
      { count: 1, dataCodewords: 50 },
      { count: 4, dataCodewords: 51 }
    ]
  }, // V11
  {
    totalCodewords: 466,
    groups: [
      { count: 6, dataCodewords: 36 },
      { count: 2, dataCodewords: 37 }
    ]
  }, // V12
  {
    totalCodewords: 532,
    groups: [
      { count: 8, dataCodewords: 37 },
      { count: 1, dataCodewords: 38 }
    ]
  }, // V13
  {
    totalCodewords: 581,
    groups: [
      { count: 4, dataCodewords: 40 },
      { count: 5, dataCodewords: 41 }
    ]
  }, // V14
  {
    totalCodewords: 655,
    groups: [
      { count: 5, dataCodewords: 41 },
      { count: 5, dataCodewords: 42 }
    ]
  }, // V15
  {
    totalCodewords: 733,
    groups: [
      { count: 7, dataCodewords: 45 },
      { count: 3, dataCodewords: 46 }
    ]
  }, // V16
  {
    totalCodewords: 815,
    groups: [
      { count: 10, dataCodewords: 46 },
      { count: 1, dataCodewords: 47 }
    ]
  }, // V17
  {
    totalCodewords: 901,
    groups: [
      { count: 9, dataCodewords: 43 },
      { count: 4, dataCodewords: 44 }
    ]
  }, // V18
  {
    totalCodewords: 991,
    groups: [
      { count: 3, dataCodewords: 44 },
      { count: 11, dataCodewords: 45 }
    ]
  }, // V19
  {
    totalCodewords: 1085,
    groups: [
      { count: 3, dataCodewords: 41 },
      { count: 13, dataCodewords: 42 }
    ]
  }, // V20
  { totalCodewords: 1156, groups: [{ count: 17, dataCodewords: 42 }] }, // V21
  {
    totalCodewords: 1258,
    groups: [
      { count: 17, dataCodewords: 46 },
      { count: 1, dataCodewords: 47 }
    ]
  }, // V22
  {
    totalCodewords: 1364,
    groups: [
      { count: 4, dataCodewords: 47 },
      { count: 14, dataCodewords: 48 }
    ]
  }, // V23
  {
    totalCodewords: 1474,
    groups: [
      { count: 6, dataCodewords: 45 },
      { count: 14, dataCodewords: 46 }
    ]
  }, // V24
  {
    totalCodewords: 1588,
    groups: [
      { count: 8, dataCodewords: 47 },
      { count: 13, dataCodewords: 48 }
    ]
  }, // V25
  {
    totalCodewords: 1706,
    groups: [
      { count: 19, dataCodewords: 46 },
      { count: 4, dataCodewords: 47 }
    ]
  }, // V26
  {
    totalCodewords: 1828,
    groups: [
      { count: 22, dataCodewords: 45 },
      { count: 3, dataCodewords: 46 }
    ]
  }, // V27
  {
    totalCodewords: 1921,
    groups: [
      { count: 3, dataCodewords: 45 },
      { count: 23, dataCodewords: 46 }
    ]
  }, // V28
  {
    totalCodewords: 2051,
    groups: [
      { count: 21, dataCodewords: 45 },
      { count: 7, dataCodewords: 46 }
    ]
  }, // V29
  {
    totalCodewords: 2185,
    groups: [
      { count: 19, dataCodewords: 47 },
      { count: 10, dataCodewords: 48 }
    ]
  }, // V30
  {
    totalCodewords: 2323,
    groups: [
      { count: 2, dataCodewords: 46 },
      { count: 29, dataCodewords: 47 }
    ]
  }, // V31
  {
    totalCodewords: 2465,
    groups: [
      { count: 10, dataCodewords: 46 },
      { count: 23, dataCodewords: 47 }
    ]
  }, // V32
  {
    totalCodewords: 2611,
    groups: [
      { count: 14, dataCodewords: 46 },
      { count: 21, dataCodewords: 47 }
    ]
  }, // V33
  {
    totalCodewords: 2761,
    groups: [
      { count: 14, dataCodewords: 46 },
      { count: 23, dataCodewords: 47 }
    ]
  }, // V34
  {
    totalCodewords: 2876,
    groups: [
      { count: 12, dataCodewords: 47 },
      { count: 26, dataCodewords: 48 }
    ]
  }, // V35
  {
    totalCodewords: 3034,
    groups: [
      { count: 6, dataCodewords: 47 },
      { count: 34, dataCodewords: 48 }
    ]
  }, // V36
  {
    totalCodewords: 3196,
    groups: [
      { count: 29, dataCodewords: 46 },
      { count: 14, dataCodewords: 47 }
    ]
  }, // V37
  {
    totalCodewords: 3362,
    groups: [
      { count: 13, dataCodewords: 46 },
      { count: 32, dataCodewords: 47 }
    ]
  }, // V38
  {
    totalCodewords: 3532,
    groups: [
      { count: 40, dataCodewords: 47 },
      { count: 7, dataCodewords: 48 }
    ]
  }, // V39
  {
    totalCodewords: 3706,
    groups: [
      { count: 18, dataCodewords: 47 },
      { count: 31, dataCodewords: 48 }
    ]
  } // V40
]

// Byte 模式下各版本最大载荷字节数 (ECC-M)
export const MAX_PAYLOAD_BYTES: number[] = [
  0,
  14,
  26,
  42,
  62,
  84,
  106,
  122,
  152,
  180,
  213, // V1-10
  251,
  287,
  331,
  362,
  412,
  450,
  504,
  560,
  624,
  666, // V11-20
  711,
  779,
  857,
  911,
  997,
  1059,
  1125,
  1190,
  1264,
  1370, // V21-30
  1452,
  1538,
  1628,
  1722,
  1809,
  1911,
  1989,
  2099,
  2213,
  2331 // V31-40
]

// 对齐图案中心坐标 (V1 无对齐图案)
export const ALIGNMENT_POSITIONS: number[][] = [
  [], // V1
  [6, 18], // V2
  [6, 22], // V3
  [6, 26], // V4
  [6, 30], // V5
  [6, 34], // V6
  [6, 22, 38], // V7
  [6, 24, 42], // V8
  [6, 26, 46], // V9
  [6, 28, 50], // V10
  [6, 30, 54], // V11
  [6, 32, 58], // V12
  [6, 34, 62], // V13
  [6, 26, 46, 66], // V14
  [6, 26, 48, 70], // V15
  [6, 26, 50, 74], // V16
  [6, 30, 54, 78], // V17
  [6, 30, 56, 82], // V18
  [6, 30, 58, 86], // V19
  [6, 34, 62, 90], // V20
  [6, 28, 50, 72, 94], // V21
  [6, 26, 50, 74, 98], // V22
  [6, 30, 54, 78, 102], // V23
  [6, 28, 54, 80, 106], // V24
  [6, 32, 58, 84, 110], // V25
  [6, 30, 58, 86, 114], // V26
  [6, 34, 62, 90, 118], // V27
  [6, 26, 50, 74, 98, 122], // V28
  [6, 30, 54, 78, 102, 126], // V29
  [6, 26, 52, 78, 104, 130], // V30
  [6, 30, 56, 82, 108, 134], // V31
  [6, 34, 60, 86, 112, 138], // V32
  [6, 30, 58, 86, 114, 142], // V33
  [6, 34, 62, 90, 118, 146], // V34
  [6, 30, 54, 78, 102, 126, 150], // V35
  [6, 24, 50, 76, 102, 128, 154], // V36
  [6, 28, 54, 80, 106, 132, 158], // V37
  [6, 32, 58, 84, 110, 136, 162], // V38
  [6, 26, 54, 82, 110, 138, 166], // V39
  [6, 30, 58, 86, 114, 142, 170] // V40
]
