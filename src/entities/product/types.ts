// 상품 아이템 타입
export interface ProductItem {
  goodsNo: string;
  goodsNm: string;
  imageUrl: string;
  brand: string;
  price: number;
  onClick: {
    url: string;
  };
}

// 탭 타입
export interface CategoryTab {
  tab: string;
  categoryCode: string;
  type: string; // TAB_OUTLINED 등
}

// 상품 API 응답 타입
export interface ProductApiResponse {
  data: {
    modules: ProductItem[];
  };
}

// 탭 API 응답 타입
export interface TabApiResponse {
  tabs: CategoryTab[];
}

// Musinsa 카테고리 API TAB_OUTLINED 타입 정의

export interface MusinsaTabOnClick {
  eventLog?: unknown;
  isHighlighted?: boolean;
}

export interface MusinsaTabText {
  text: string;
}

export interface MusinsaTabParams {
  storeCode: string;
  sectionId: string;
  contentsId: string;
  categoryCode: string;
}

export interface MusinsaCategoryTab {
  key: string;
  tabs: MusinsaCategoryTab[]; // 2depth, 3depth 등 중첩 가능
  params: MusinsaTabParams;
  text: MusinsaTabText;
  onClick?: MusinsaTabOnClick;
  isHighlighted?: boolean;
}

export interface MusinsaTabModule {
  id: string;
  type: "TAB_OUTLINED";
  apiUrl: string;
  hasDivider: boolean;
  tabs: MusinsaCategoryTab[];
  params: MusinsaTabParams;
  text: MusinsaTabText;
  impressionEventLog?: unknown;
  onClick?: MusinsaTabOnClick;
  isHighlighted?: boolean;
}

export interface MusinsaCategoryApiResponse {
  data: {
    modules: MusinsaTabModule[];
  };
}

// Musinsa 상품 랭킹 API MULTICOLUMN 모듈 타입 정의

export interface MusinsaProductInfo {
  brandName: string;
  productName: string;
  discountRatio: number;
  finalPrice: number;
  strikethrough: boolean;
  additionalInformation: string[];
  onClickBrandName?: {
    url: string;
    // eventLog 등 생략
  };
}

export interface MusinsaProductImage {
  url: string;
  // 기타 필드 생략
}

export interface MusinsaProductItem {
  type: "PRODUCT_COLUMN";
  id: string;
  info: MusinsaProductInfo;
  image: MusinsaProductImage;
  onClick: {
    url: string;
    // eventLog 등 생략
  };
  // 기타 필드 생략
}

export interface MusinsaMultiColumnModule {
  id: string;
  type: "MULTICOLUMN";
  items: MusinsaProductItem[];
  displayCount: number;
}

export interface MusinsaProductRankingResponse {
  data: {
    modules: MusinsaMultiColumnModule[];
  };
  meta: {
    result: string;
    errorCode: string;
    message: string;
  };
}
