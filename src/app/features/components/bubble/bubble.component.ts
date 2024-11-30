import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.scss',
})
export class BubbleComponent implements OnInit {
  @Input() bubbleMessage?: string;
  @Input() bubbleType: string = '';
  @Input() direction: 'right' | 'bottom' | 'left' | 'top' = 'right';

  public showBubble: boolean = false;

  private trashMessages: string[] = [
    'Bin there, done that....',
    'Refused to recycle? That attitude stinks.',
    'I’m not trash, I’m just misunderstood.',
    'I’m not trashy; I’m just down to earth.',
    'What did the garbage say to the other garbage? “You stink!”',
    'What’s a trash can’s favorite hobby? Dumpster diving!',
    'I’m on a diet... no junk allowed!',
    'Trash talk? That’s my specialty!',
    'I’m not just a can... I’m a trash-ion statement!',
    'Why did the trash can bring a ladder? To take out the high garbage!',
    'You think I’m empty? I’m just taking out my feelings.',
    'They call me the king of trash... because I rule the bin-dustry.',
    "Life's tough, but at least I don’t have to deal with recycling drama.",
    'I’ve got layers, like an onion... or a landfill.',
    'Don’t dump your problems on me... unless they’re biodegradable.',
    'What’s a trash can’s favorite music? Heavy metal!',
  ];

  ngOnInit(): void {}

  public toggleBubble(): void {
    if (this.bubbleType === 'trash-can') {
      this.randomeMessage();
    }

    this.showBubble = true;
    setTimeout(() => (this.showBubble = false), 3000);
  }

  public randomeMessage() {
    const randomIndex = Math.floor(Math.random() * this.trashMessages.length);
    this.bubbleMessage = this.trashMessages[randomIndex];
  }
}
