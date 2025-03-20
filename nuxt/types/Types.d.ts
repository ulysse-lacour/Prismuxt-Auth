import type {
  ContentBlock,
  Portfolio,
  PortfolioProject,
  Project,
  ProjectContent,
} from "@prisma/client";

declare global {
  // Declare custom types in here
  interface ProjectWithLinkStatus extends Project {
    isLinked: boolean;
  }

  interface ProjectWithContentBlocks extends ProjectContent {
    contentBlocks: ContentBlock[];
  }

  interface ProjectTagWithName extends ProjectTag {
    tag: Tag;
  }

  interface ProjectWithTags extends Project {
    projectTags: ProjectTagWithName[];
    portfolioProjects?: PortfolioProject[];
    projectContents?: ProjectContent[];
  }

  interface PortfolioWithProjects extends Portfolio {
    portfolioProjects: (PortfolioProject & {
      project: ProjectWithTags;
    })[];
  }

  interface PortfolioDetails extends Portfolio {
    portfolioProjects: (PortfolioProject & {
      project: ProjectWithTags;
    })[];
  }
}
export {};
