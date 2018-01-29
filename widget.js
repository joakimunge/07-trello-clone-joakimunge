$.widget( "manowar.lyrics", {

    options: {
        lyrics: [` 
            Kill their metal
            Feel my enemies without master
            Hail our mighty glory and magic honor
            They feel my power with horse
        `,
        ` 
            We feel your sword and the sword without magic warrior
            Feel sword
            Ride their honor without fierce fire
            Burn their blood
        `,
        ` 
            By moonlight we ride ten thousands side by side
            With swords drawn held high our whips and armour shine
            Hail to thee our infantry still brave beyond the grave
            All sworn the eternal vow the time to strike is now
        `,
        ` 
            Brothers I am calling from the valley of the kings
            With nothing to atone
            A dark march lies ahead, together we will ride
            Like thunder from the sky
            May your sword stay wet like a young girl in her prime
            Hold your hammers high
        `
        ]
    },

    _create: function() {
            const obj = this.options;
            const lyric = obj.lyrics[Math.floor(Math.random() * obj.lyrics.length)];

            console.log(lyric);
    }
    
});