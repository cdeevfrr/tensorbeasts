import React from 'react';
import { ScrollView, Image, View } from 'react-native';
import Markdown from 'react-native-markdown-display'; // This library is old & pretty bad. Remove it if you can, it's just convenient.

// const localImage = Image.resolveAssetSource(require('../assets/images/Tutorial/starter.png')).uri;

const copy = `
# How to play

Good games teach you to play by slowly exposing you to new features as you play.

That's hard, so instead, here's an outline of what we _would_ put in a tutorial!

You can mostly follow along if you open this documentation & the homepage in separate tabs. [Homepage](../)

## Day 1

Enter a dungeon.

Since it's the tutorial, we'll start with only one beast on your team. That's the blue snake.

![Image](dungeon_0)

Once you enter, you're the grey circle. Move up and down 
by hitting the blue arrows.

![Image](dungeon_1)

Keep moving until you get a battle.

![Image](starter_1)

Click Attack, choose your only beast (the snake) to be the core attacker,
attacks will load so you can click "do it". Repeat until you defeat the enemy!

![Image](starter_2)

![Image](starter_3)

Yay!

## Day 2

- What are those circles in the middle of the battle?
- Why are there purple boxes? 
- What's this white box at the right?

Great questions! Let's add a support beast to your team.

Click "Leave Dungeon" and hit the "manage parties" button. 

![Image](home_1)

Now, click the bottom left grey box (that's important! Position matters!) 

Select the first purple penguin to go in that spot.

![Image](party_1)

Your party should look like this now

![Image](party_2)

Hold down on your new purple penguin to see its detail view.

Here's what it looks like now (it's not broken! I just haven't built it better yet.)

![Image](party_3)

Notice the support skill? That's gonna come in handy!

You can hold down on our snek and see that it doesn't have a support skill

![Image](party_4)

Ok, now _SAVE_, go back to a dungeon, and move up and down until you get another battle!

![Image](support_1)

This time, instead of attacking right away, hold down the 'charge' button for a bit. 

![Image](support_2)

Notice the charge bar under our penguin has increased (And so has the enemy's)

![Image](support_3)

Once ours is full, click our penguin!

![Image](support_4)

Use "Simple destroy 2" and destroy the middle block (yes, I know they're balls not blocks. Oh well.)

Look! You destroyed the middle block! And a new block fell from above! Also, we have a "Destroy event" in the stack at the right!

![Image](support_5)

The destroy event will make our attacks (and our enemies) stronger. Exactly how much stronger depends on which beasts you have on your team.

Congrats! You just used your first support skill! Go ahead and finish the battle.

![Image](support_6)

## Day 3

So, the box at the right is the "Stack", and it keeps track of destroy events you've caused.
The circles in the middle are "Blocks", and all together they make up the "Board". 
The bottom is your party; the top is the enemy party. 

- What are the purple boxes? 

Oh, did I forget one?

### Party Makeup

A party has three sections; Vanguard, core, and support.

![Image](makeup_1)

When attacks are calculated, the Vanguard always does damage first; your team's Vanguard, then the enemy team's Vanguard; then the rest of your team and finally the rest of the enemy team. The Vanguard is a good spot for for your highest attack beasts.

The Core section decides your playstyle. Our starting snake gives us Core skills that find groups of three blocks of the same color (we'll see that later!) and that gives attack power to all beasts equally, where the attack power is based on the number of blocks destroyed in the stack. If you run out of valid core beasts, you can't attack and that dungeon run is over. You can find other good core beasts to do damage in different ways, or that make groups in different ways!

The support section is for utility. You can use special skills from the beasts here to help you maximize your chances to make the kinds of groups you want, or to give short-term boosts to your team. Charge only affects these beasts. If you put a beast with a good support skill in vanguard or core, it won't be able to use it.

We haven't learned about passive skills yet; but they're important too! Passive skills only take effect for beasts in the Vanguard or Support sections - the Core beasts are too busy making your playstyle work. 

Passive skills can be incredibly important, especially the crucial _dimensional_ passive skills. 

### Continuing on

Let's see if we can't find ourselves a beast with a dimensional passive skill!

Go to the dungeon and head either up or down, but go as far as you can. You should see a light green square.

![Image](dimension_1)

You need to get into a battle _on that square_ (not the one next to it.) It may take some grinding. Once the battle starts, click and hold on the enemy in the Vanguard, and make sure that it has a passive skill which adds to the _second_ dimension. Keep defeating these beasts until you get a beast with this kind of passive skill as a drop!

![Image](dimension_2)

Sad, I didn't get my first drop:

![Image](dimension_3)

It took me about 3 dungeon runs to build up my party and get my first dimension 2 beast drop.

![Image](dimension_4)

Now, leave the dungeon; go back to manage your parties; and make a party where your dimension 2 beast is in the vanguard, so its passive skills will take effect.

![Image](dimension_5)

Head back into the dungeon.

Wow!!! There's a whole new dimension!!!

![Image](dimension_6)

You can now move in the X direction, like you have been; or in the Y direction, going left and right!

Congrats on finishing day 3!

## Day 4

Your fancy new dimension doesn't just apply to the dungeon. You also added a dimension to the board! 

Try to use your support skills to get a group of 3 blocks of one color all touching. Diagonals don't count. What happens after you confirm your core beast? That's our snake's core grouping skill at work! 

![Image](group_2)

What happens if your dimension beast dies while you're off in the orange squares?

### Core skill & support skill interactions
You can charge any time before you pick a core beast, and charge is maintained between battles; 
You can use that charge to execute support skills at any time before you click the "do it" button. 

Try to optimize your support skills to maximize the number of groups your core beast can find before attacking!


## Fin 
(of the tutorial)

Now, go explore! Find new kinds of core skills; new support skills, and more dimensions! 

## Have fun!





`

const images = {
    starter_1: require('../assets/images/Tutorial/starter_1.png'),
    starter_2: require('../assets/images/Tutorial/starter_2.png'),
    starter_3: require('../assets/images/Tutorial/starter_3.png'),
    dungeon_0: require('../assets/images/Tutorial/dungeon_0.png'),
    dungeon_1: require('../assets/images/Tutorial/dungeon_1.png'),
    home_1: require('../assets/images/Tutorial/home_1.png'),
    party_1: require('../assets/images/Tutorial/party_1.png'),
    party_2: require('../assets/images/Tutorial/party_2.png'),
    party_3: require('../assets/images/Tutorial/party_3.png'),
    party_4: require('../assets/images/Tutorial/party_4.png'),
    support_1: require('../assets/images/Tutorial/support_1.png'),
    support_2: require('../assets/images/Tutorial/support_2.png'),
    support_3: require('../assets/images/Tutorial/support_3.png'),
    support_4: require('../assets/images/Tutorial/support_4.png'),
    support_5: require('../assets/images/Tutorial/support_5.png'),
    support_6: require('../assets/images/Tutorial/support_6.png'),
    makeup_1: require('../assets/images/Tutorial/makeup_1.png'),
    dimension_1: require('../assets/images/Tutorial/dimension_1.png'),
    dimension_2: require('../assets/images/Tutorial/dimension_2.png'),
    dimension_3: require('../assets/images/Tutorial/dimension_3.png'),
    dimension_4: require('../assets/images/Tutorial/dimension_4.png'),
    dimension_5: require('../assets/images/Tutorial/dimension_5.png'),
    dimension_6: require('../assets/images/Tutorial/dimension_6.png'),
    group_1: require('../assets/images/Tutorial/group_1.png'),
    group_2: require('../assets/images/Tutorial/group_2.png'),

}

export default function Documentation() {
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{ height: '90%', margin: '7%', padding: '3%' }}
        >
            <View style={{width: '90%', flex: 1}}>
            <Markdown 
              rules={{
                image: (node) => {
                    const inMarkdown = node.attributes.src as keyof typeof images
                    return <Image source={images[inMarkdown]} style={{flex: 1, resizeMode: 'contain', height: 300}}></Image>
                }
            }}>
                {copy}
            </Markdown>
            </View>
        </ScrollView>
    );
}
