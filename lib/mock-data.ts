export type Folder = {
  id: string;
  name: string;
};

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnailUrl?: string;
  folderId: string;
};

export const folders: Folder[] = [
  { id: "dev", name: "개발" },
  { id: "design", name: "디자인" },
  { id: "cooking", name: "요리" },
  { id: "read-later", name: "나중에 읽기" },
];

export const links: LinkItem[] = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Next.js의 공식 문서로, App Router와 최신 기능을 확인할 수 있어요.",
    folderId: "dev",
  },
  {
    id: "2",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
    description: "유틸리티 우선 CSS 프레임워크 공식 문서.",
    folderId: "dev",
  },
  {
    id: "3",
    title: "Dribbble - Discover the World's Top Designers",
    url: "https://dribbble.com",
    description: "디자인 영감을 얻을 수 있는 커뮤니티 사이트.",
    folderId: "design",
  },
  {
    id: "4",
    title: "만개의레시피",
    url: "https://www.10000recipe.com",
    description: "오늘 저녁에 만들어볼 만한 간단한 요리 레시피 모음.",
    folderId: "cooking",
  },
  {
    id: "5",
    title: "김치볶음밥 황금 레시피",
    url: "https://www.10000recipe.com/recipe/list.html?q=%EA%B9%80%EC%B9%98%EB%B3%B6%EC%9D%8C%EB%B0%A5",
    description: "냉장고 속 김치로 5분 만에 완성하는 볶음밥.",
    folderId: "cooking",
  },
  {
    id: "6",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 표준 기술에 대한 가장 신뢰할 수 있는 레퍼런스.",
    folderId: "dev",
  },
  {
    id: "7",
    title: "나중에 읽어볼 아티클",
    url: "https://example.com/article",
    description: "시간 날 때 정독하고 싶은 아티클.",
    folderId: "read-later",
  },
  {
    id: "8",
    title: "Figma Community",
    url: "https://www.figma.com/community",
    description: "다양한 디자인 리소스와 템플릿을 공유하는 공간.",
    folderId: "design",
  },
];
